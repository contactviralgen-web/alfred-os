import "server-only"

import { createClient } from "@/lib/supabase/server"
import { enregistrerRecommandation, remplacerRecommandationsAgent } from "@/modules/agents/services/recommendations.service"
import { calculerJoursAvantRupture } from "@/engine/metrics"

// AGENT 3 — Inventory Agent (document). Objectif : répondre à "quand
// commander ?" en croisant le rythme de vente réel et le délai fournisseur
// réellement constaté — pas une estimation, les deux viennent de données
// déjà en base (order_items, supplier_order_items → suppliers).
export const objectifAgentStock = "Détecter les risques de rupture et indiquer quand commander."
export const sourcesDonneesAgentStock = [
  "order_items (rythme de vente)",
  "stock_levels (stock actuel)",
  "supplier_order_items + suppliers.delai_livraison_jours (délai réapprovisionnement)",
]

const DELAI_FOURNISSEUR_PAR_DEFAUT_JOURS = 14
const PERIODE_VELOCITE_JOURS = 30

export async function analyserStock(organizationId: string, workspaceId: string) {
  await remplacerRecommandationsAgent(workspaceId, "stock")

  const supabase = await createClient()
  const depuis = new Date(Date.now() - PERIODE_VELOCITE_JOURS * 86400000).toISOString()

  const [{ data: produits }, { data: ventes }, { data: dernieresCommandesFournisseur }] = await Promise.all([
    supabase
      .from("products")
      .select("id, nom, stock_levels(quantite_disponible)")
      .eq("workspace_id", workspaceId)
      .eq("actif", true),
    supabase
      .from("order_items")
      .select("product_id, quantite, orders!inner(workspace_id, cree_le, statut)")
      .eq("orders.workspace_id", workspaceId)
      .neq("orders.statut", "annulee")
      .gte("orders.cree_le", depuis),
    supabase
      .from("supplier_order_items")
      .select("product_id, cree_le, supplier_orders(supplier_id, suppliers(delai_livraison_jours))")
      .order("cree_le", { ascending: false }),
  ])

  const venteParProduit = new Map<string, number>()
  for (const ligne of ventes ?? []) {
    if (!ligne.product_id) continue
    venteParProduit.set(ligne.product_id, (venteParProduit.get(ligne.product_id) ?? 0) + ligne.quantite)
  }

  const delaiParProduit = new Map<string, number>()
  for (const ligne of dernieresCommandesFournisseur ?? []) {
    if (!ligne.product_id || delaiParProduit.has(ligne.product_id)) continue
    const fournisseur = Array.isArray(ligne.supplier_orders)
      ? ligne.supplier_orders[0]?.suppliers
      : ligne.supplier_orders?.suppliers
    const delai = Array.isArray(fournisseur) ? fournisseur[0]?.delai_livraison_jours : fournisseur?.delai_livraison_jours
    if (typeof delai === "number") delaiParProduit.set(ligne.product_id, delai)
  }

  let creees = 0
  let produitsAnalyses = 0

  for (const produit of produits ?? []) {
    const niveau = Array.isArray(produit.stock_levels) ? produit.stock_levels[0] : produit.stock_levels
    const stockActuel = niveau?.quantite_disponible ?? 0
    const ventesPeriode = venteParProduit.get(produit.id) ?? 0
    const ventesQuotidiennesMoyennes = ventesPeriode / PERIODE_VELOCITE_JOURS
    if (ventesQuotidiennesMoyennes <= 0) continue
    produitsAnalyses++

    const delaiFournisseurJours = delaiParProduit.get(produit.id) ?? DELAI_FOURNISSEUR_PAR_DEFAUT_JOURS
    const joursAvantRupture = calculerJoursAvantRupture(stockActuel, ventesQuotidiennesMoyennes)

    if (joursAvantRupture !== null && joursAvantRupture <= delaiFournisseurJours) {
      const dateCommandeLimite = new Date(Date.now() + Math.max(0, joursAvantRupture - delaiFournisseurJours) * 86400000)
      await enregistrerRecommandation(organizationId, workspaceId, {
        agent: "stock",
        problemeDetecte: `"${produit.nom}" — rupture dans ${joursAvantRupture} jour(s) au rythme actuel.`,
        analyseIa: `Stock actuel : ${stockActuel} unité(s), ventes moyennes : ${ventesQuotidiennesMoyennes.toFixed(1)}/jour, délai fournisseur : ${delaiFournisseurJours} jour(s).`,
        recommandation:
          joursAvantRupture <= 0
            ? `Commander "${produit.nom}" immédiatement.`
            : `Commander "${produit.nom}" avant le ${dateCommandeLimite.toLocaleDateString("fr-FR")}.`,
        impactEstimeEur: null,
      })
      creees++
    }
  }

  return { produitsAnalyses, recommandationsCreees: creees }
}
