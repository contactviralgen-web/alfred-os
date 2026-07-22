import "server-only"

import { createClient } from "@/lib/supabase/server"

export type DonneesFournisseur = {
  nom: string
  email?: string | null
  telephone?: string | null
  adresse?: string | null
  notes?: string | null
  statut?: "actif" | "inactif"
  delai_livraison_jours?: number | null
}

// Score de recommandation déterministe (0-100), sans IA, calculé
// UNIQUEMENT à partir de l'historique réel de commandes livrées : 60%
// ponctualité constatée + 40% précision du délai (écart entre le délai réel
// moyen constaté et le délai annoncé par le fournisseur). Pas de note
// manuelle : sans commande livrée, il n'y a rien à mesurer → pas de score.
export function calculerScoreRecommandation(params: {
  tauxPonctualite: number | null
  ecartDelaiMoyenJours: number | null
}): number | null {
  const { tauxPonctualite, ecartDelaiMoyenJours } = params
  if (tauxPonctualite === null) return null

  const scorePonctualite = tauxPonctualite
  // Écart nul ou négatif (livré en avance/à temps) = score plein ; chaque
  // jour de retard moyen coûte des points, plafonné à 0.
  const scorePrecisionDelai =
    ecartDelaiMoyenJours === null
      ? scorePonctualite
      : Math.max(0, 100 - Math.max(0, ecartDelaiMoyenJours) * 10)

  return Math.round(scorePonctualite * 0.6 + scorePrecisionDelai * 0.4)
}

async function obtenirPerformances(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("supplier_orders")
    .select("supplier_id, statut, date_commande, date_livraison_prevue, date_livraison_reelle")
    .eq("workspace_id", workspaceId)
    .eq("statut", "livree")

  const parFournisseur = new Map<
    string,
    { livreesAvecDates: number; livreesATemps: number; sommeEcartJours: number; nbEcarts: number }
  >()

  for (const commande of data ?? []) {
    if (!commande.date_livraison_prevue || !commande.date_livraison_reelle) continue
    const existant = parFournisseur.get(commande.supplier_id) ?? {
      livreesAvecDates: 0,
      livreesATemps: 0,
      sommeEcartJours: 0,
      nbEcarts: 0,
    }
    existant.livreesAvecDates += 1
    const ecartJours =
      (new Date(commande.date_livraison_reelle).getTime() -
        new Date(commande.date_livraison_prevue).getTime()) /
      86400000
    if (ecartJours <= 0) existant.livreesATemps += 1
    existant.sommeEcartJours += ecartJours
    existant.nbEcarts += 1
    parFournisseur.set(commande.supplier_id, existant)
  }

  return parFournisseur
}

function tauxPonctualite(perf: { livreesAvecDates: number; livreesATemps: number } | undefined): number | null {
  if (!perf || perf.livreesAvecDates === 0) return null
  return Math.round((perf.livreesATemps / perf.livreesAvecDates) * 100)
}

function ecartDelaiMoyenJours(perf: { sommeEcartJours: number; nbEcarts: number } | undefined): number | null {
  if (!perf || perf.nbEcarts === 0) return null
  return perf.sommeEcartJours / perf.nbEcarts
}

export async function listerFournisseurs(workspaceId: string) {
  const supabase = await createClient()
  const [{ data: fournisseurs }, performances] = await Promise.all([
    supabase
      .from("suppliers")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("cree_le", { ascending: false }),
    obtenirPerformances(workspaceId),
  ])

  const fournisseursAvecScore = (fournisseurs ?? []).map((f) => {
    const perf = performances.get(f.id)
    const taux = tauxPonctualite(perf)
    const score = calculerScoreRecommandation({
      tauxPonctualite: taux,
      ecartDelaiMoyenJours: ecartDelaiMoyenJours(perf),
    })
    return { ...f, tauxPonctualite: taux, scoreRecommandation: score }
  })

  const meilleurScore = Math.max(
    0,
    ...fournisseursAvecScore
      .filter((f) => f.statut === "actif" && f.scoreRecommandation !== null)
      .map((f) => f.scoreRecommandation as number)
  )

  return fournisseursAvecScore.map((f) => ({
    ...f,
    estRecommande:
      f.statut === "actif" && f.scoreRecommandation !== null && f.scoreRecommandation === meilleurScore,
  }))
}

export async function obtenirFournisseur(workspaceId: string, supplierId: string) {
  const supabase = await createClient()
  const [{ data: fournisseur }, { data: commandes }, { data: factures }, performances] =
    await Promise.all([
      supabase
        .from("suppliers")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("id", supplierId)
        .maybeSingle(),
      supabase
        .from("supplier_orders")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("supplier_id", supplierId)
        .order("date_commande", { ascending: false }),
      supabase
        .from("supplier_invoices")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("supplier_id", supplierId)
        .order("date_emission", { ascending: false }),
      obtenirPerformances(workspaceId),
    ])

  if (!fournisseur) return null

  const perf = performances.get(supplierId)
  const taux = tauxPonctualite(perf)
  const score = calculerScoreRecommandation({
    tauxPonctualite: taux,
    ecartDelaiMoyenJours: ecartDelaiMoyenJours(perf),
  })

  return {
    fournisseur,
    commandes: commandes ?? [],
    factures: factures ?? [],
    tauxPonctualite: taux,
    scoreRecommandation: score,
  }
}

export async function creerFournisseur(
  organizationId: string,
  workspaceId: string,
  donnees: DonneesFournisseur
) {
  const supabase = await createClient()
  const { error } = await supabase.from("suppliers").insert({
    organization_id: organizationId,
    workspace_id: workspaceId,
    ...donnees,
  })
  if (error) throw new Error("Impossible de créer le fournisseur.")
}

export async function mettreAJourFournisseur(
  supplierId: string,
  donnees: Partial<DonneesFournisseur>
) {
  const supabase = await createClient()
  const { error } = await supabase.from("suppliers").update(donnees).eq("id", supplierId)
  if (error) throw new Error("Impossible de mettre à jour le fournisseur.")
}
