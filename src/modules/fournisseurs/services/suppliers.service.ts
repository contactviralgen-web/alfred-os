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
  note_performance?: number | null
}

// Score de recommandation déterministe (0-100), sans IA : moyenne pondérée de
// la note de performance manuelle (40%), du taux de livraison à temps (40%) et
// d'un bonus lié à la rapidité du délai annoncé (20%, plus le délai est court
// meilleur est le score).
export function calculerScoreRecommandation(params: {
  notePerformance: number | null
  tauxPonctualite: number | null
  delaiLivraisonJours: number | null
}): number {
  const { notePerformance, tauxPonctualite, delaiLivraisonJours } = params

  const scoreNote = notePerformance !== null ? (notePerformance / 5) * 100 : 50
  const scorePonctualite = tauxPonctualite !== null ? tauxPonctualite : 50
  const scoreDelai =
    delaiLivraisonJours !== null
      ? Math.max(0, 100 - Math.min(delaiLivraisonJours, 60) * (100 / 60))
      : 50

  const score = scoreNote * 0.4 + scorePonctualite * 0.4 + scoreDelai * 0.2
  return Math.round(score)
}

async function obtenirPerformances(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("v_supplier_performance")
    .select("*")
    .eq("workspace_id", workspaceId)

  const parFournisseur = new Map(
    (data ?? []).map((p) => [
      p.supplier_id,
      {
        commandesLivrees: p.commandes_livrees ?? 0,
        commandesLivreesAvecDates: p.commandes_livrees_avec_dates ?? 0,
        commandesLivreesATemps: p.commandes_livrees_a_temps ?? 0,
      },
    ])
  )
  return parFournisseur
}

function tauxPonctualite(perf: {
  commandesLivreesAvecDates: number
  commandesLivreesATemps: number
} | undefined): number | null {
  if (!perf || perf.commandesLivreesAvecDates === 0) return null
  return Math.round((perf.commandesLivreesATemps / perf.commandesLivreesAvecDates) * 100)
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

  return (fournisseurs ?? []).map((f) => {
    const perf = performances.get(f.id)
    const taux = tauxPonctualite(perf)
    const score = calculerScoreRecommandation({
      notePerformance: f.note_performance,
      tauxPonctualite: taux,
      delaiLivraisonJours: f.delai_livraison_jours,
    })
    return { ...f, tauxPonctualite: taux, scoreRecommandation: score }
  })
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
    notePerformance: fournisseur.note_performance,
    tauxPonctualite: taux,
    delaiLivraisonJours: fournisseur.delai_livraison_jours,
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
