import "server-only"

import { obtenirMargesParProduit } from "@/modules/rentabilite/services/margins.service"
import { enregistrerRecommandation, remplacerRecommandationsAgent } from "@/modules/agents/services/recommendations.service"

// AGENT 1 — Profit Agent (document). Objectif : "Quels produits détruisent
// de la marge ? Quels produits sont sous-exploités ?" S'appuie sur
// src/engine/profitability.ts via margins.service.ts — jamais de chiffre
// inventé, uniquement la marge nette réelle déjà calculée par l'engine.
export const objectifAgentProfit = "Identifier les produits qui détruisent la marge et ceux à prioriser."
export const sourcesDonneesAgentProfit = [
  "orders + order_items (ventes)",
  "products + product_cost_settings (charges réelles par produit)",
  "workspace_cost_settings (TVA)",
]

const PERIODE_ANALYSE_JOURS = 30
const NB_PRODUITS_DEFICITAIRES_MAX = 5

export async function analyserRentabilite(organizationId: string, workspaceId: string) {
  await remplacerRecommandationsAgent(workspaceId, "rentabilite")

  const fin = new Date()
  const debut = new Date(fin.getTime() - PERIODE_ANALYSE_JOURS * 86400000)
  const marges = await obtenirMargesParProduit(workspaceId, { debut: debut.toISOString(), fin: fin.toISOString() })

  let creees = 0

  const deficitaires = marges.filter((p) => p.margeNette < 0).slice(0, NB_PRODUITS_DEFICITAIRES_MAX)
  for (const produit of deficitaires) {
    await enregistrerRecommandation(organizationId, workspaceId, {
      agent: "rentabilite",
      problemeDetecte: `"${produit.nom}" déficitaire (${Math.round(produit.margeNette)}€ sur ${PERIODE_ANALYSE_JOURS}j).`,
      analyseIa: `${produit.unitesVendues} unité(s) vendues pour ${Math.round(produit.chiffreAffaires)}€ de chiffre d'affaires, marge nette négative une fois les charges réelles déduites.`,
      recommandation: `Revoir le prix ou les charges de "${produit.nom}" en priorité.`,
      impactEstimeEur: produit.margeNette,
    })
    creees++
  }

  const meilleur = marges[0]
  if (meilleur && meilleur.margeNette > 0 && deficitaires.length < marges.length) {
    await enregistrerRecommandation(organizationId, workspaceId, {
      agent: "rentabilite",
      problemeDetecte: `"${meilleur.nom}" est le produit le plus rentable (${meilleur.margePct.toFixed(0)}% de marge nette).`,
      analyseIa: `${meilleur.unitesVendues} unité(s) vendues pour ${Math.round(meilleur.margeNette)}€ de marge nette sur ${PERIODE_ANALYSE_JOURS}j.`,
      recommandation: `Prioriser le réassort et la mise en avant de "${meilleur.nom}".`,
      impactEstimeEur: meilleur.margeNette,
    })
    creees++
  }

  return { produitsAnalyses: marges.length, recommandationsCreees: creees }
}
