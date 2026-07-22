import "server-only"

import { creerClientIA, estErreurCreditsEpuises, messageErreurIA, MODELE_IA } from "@/lib/ai/client"
import {
  obtenirRepartitionCanaux,
  obtenirResumeKpis,
  type ResumeKpis,
} from "@/modules/dashboard/services/revenue-metrics.service"
import { obtenirPointsGraphique } from "@/modules/dashboard/services/revenue-chart.service"
import {
  obtenirCommandesBloquees,
  obtenirTopProduits,
} from "@/modules/dashboard/services/orders-metrics.service"
import { obtenirAlertesStock } from "@/modules/dashboard/services/stock-alerts.service"
import { listerTachesUtilisateur } from "@/modules/dashboard/services/productivity.service"
import { genererReponseSimulee } from "@/modules/agents/services/directeur-fallback.service"

export type MessageChat = { role: "user" | "assistant"; content: string }

export type ContexteEntreprise = {
  kpis: ResumeKpis | null
  courbeCa: Awaited<ReturnType<typeof obtenirPointsGraphique>>
  canaux: Awaited<ReturnType<typeof obtenirRepartitionCanaux>>
  topProduits: Awaited<ReturnType<typeof obtenirTopProduits>>
  alertesStock: Awaited<ReturnType<typeof obtenirAlertesStock>>
  commandesBloquees: Awaited<ReturnType<typeof obtenirCommandesBloquees>>
  taches: Awaited<ReturnType<typeof listerTachesUtilisateur>>
}

export async function collecterDonneesEntreprise(workspaceId: string): Promise<ContexteEntreprise> {
  const [kpis, courbeCa, canaux, topProduits, alertesStock, commandesBloquees, taches] =
    await Promise.all([
      obtenirResumeKpis(workspaceId),
      obtenirPointsGraphique(workspaceId, "mois", "ca"),
      obtenirRepartitionCanaux(workspaceId),
      obtenirTopProduits(workspaceId, 8),
      obtenirAlertesStock(workspaceId),
      obtenirCommandesBloquees(workspaceId),
      listerTachesUtilisateur(workspaceId),
    ])

  return { kpis, courbeCa, canaux, topProduits, alertesStock, commandesBloquees, taches }
}

export function formaterContextePrompt(organisationNom: string, donnees: ContexteEntreprise) {
  const { kpis, courbeCa, canaux, topProduits, alertesStock, commandesBloquees, taches } = donnees

  const derniersJours = courbeCa
    .slice(-14)
    .map((p) => `${p.date}: ${p.valeur}€`)
    .join(", ")

  return `Tu es le Directeur IA de "${organisationNom}" sur Pilot, une plateforme de pilotage d'entreprise. Tu es un conseiller d'affaires direct, factuel et orienté action.

Règles :
- Réponds toujours en français.
- Base tes réponses UNIQUEMENT sur les données ci-dessous. Ne fais pas d'affirmations chiffrées non vérifiées.
- Si une question sort du périmètre des données disponibles, dis-le clairement plutôt que d'inventer.
- Sois concis : réponses de quelques phrases sauf si l'utilisateur demande une analyse détaillée.
- Termine par une recommandation concrète quand c'est pertinent.

=== DONNÉES DE L'ENTREPRISE (temps réel) ===

Résumé des 30 derniers jours :
- Chiffre d'affaires : ${kpis?.ca30j.toFixed(0) ?? "N/A"}€ (croissance ${kpis?.croissancePct.toFixed(1) ?? "N/A"}% vs période précédente)
- Bénéfice : ${kpis?.benefice30j.toFixed(0) ?? "N/A"}€ (marge ${kpis?.margePct.toFixed(1) ?? "N/A"}%)
- Commandes : ${kpis?.commandes30j ?? "N/A"} (panier moyen ${kpis?.panierMoyen30j.toFixed(0) ?? "N/A"}€)

CA journalier (14 derniers jours) : ${derniersJours || "aucune donnée"}

Répartition des ventes par canal (30j) : ${canaux.map((c) => `${c.canal}: ${c.montant.toFixed(0)}€`).join(", ") || "aucune donnée"}

Produits les plus rentables (90j) : ${
    topProduits
      .map((p) => `${p.nom} (${p.categorie ?? "?"}) — ${p.quantite_vendue} vendus, marge ${p.marge_totale?.toFixed(0)}€`)
      .join(" | ") || "aucune donnée"
  }

Alertes de stock ouvertes (${alertesStock.length}) : ${
    alertesStock.map((a) => `${a.products?.nom} (${a.type})`).join(", ") || "aucune"
  }

Commandes bloquées (${commandesBloquees.length}) : ${
    commandesBloquees.map((c) => `${c.numero_commande} — ${c.client_nom} — ${c.montant_total}€`).join(", ") || "aucune"
  }

Tâches en cours de l'utilisateur (${taches.length}) : ${
    taches.map((t) => `${t.titre} (priorité ${t.priorite})`).join(", ") || "aucune"
  }
`
}

export async function poserQuestionDirecteur(
  organisationNom: string,
  workspaceId: string,
  historique: MessageChat[],
  question: string
): Promise<{ succes: true; reponse: string } | { succes: false; message: string }> {
  const donnees = await collecterDonneesEntreprise(workspaceId)

  try {
    const contexte = formaterContextePrompt(organisationNom, donnees)
    const client = creerClientIA()

    const response = await client.messages.create({
      model: MODELE_IA,
      max_tokens: 1536,
      thinking: { type: "adaptive" },
      system: contexte,
      messages: [
        ...historique.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: question },
      ],
    })

    const texte = response.content.find((b) => b.type === "text")
    if (response.stop_reason === "refusal" || !texte) {
      return {
        succes: false,
        message: "Le Directeur IA n'a pas pu répondre à cette question.",
      }
    }

    return { succes: true, reponse: texte.text }
  } catch (erreur) {
    if (estErreurCreditsEpuises(erreur)) {
      return { succes: true, reponse: genererReponseSimulee(question, donnees) }
    }
    return { succes: false, message: messageErreurIA(erreur) }
  }
}

export async function genererResumeMatinal(
  organisationNom: string,
  workspaceId: string
) {
  return poserQuestionDirecteur(
    organisationNom,
    workspaceId,
    [],
    "Fais-moi le résumé du matin : chiffre d'affaires, alertes importantes, priorités du jour, opportunités et risques. Sois bref et actionnable."
  )
}
