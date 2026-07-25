import "server-only"

import { createClient } from "@/lib/supabase/server"
import { obtenirResumeKpis } from "@/modules/dashboard/services/revenue-metrics.service"
import { obtenirAlertesStock } from "@/modules/dashboard/services/stock-alerts.service"
import { obtenirCommandesBloquees } from "@/modules/dashboard/services/orders-metrics.service"
import { listerRecommandationsActives } from "@/modules/agents/services/recommendations.service"

export type SanteBusiness = "bonne" | "a_surveiller" | "critique"

export type RapportHebdomadaire = {
  id: string
  santeBusiness: SanteBusiness
  santeLibelle: string
  topProblemes: string[]
  topOpportunites: string[]
  actionsRecommandees: string[]
  periodeDebut: string
  periodeFin: string
  creeLe: string
}

type LigneRapport = {
  id: string
  sante_business: SanteBusiness
  sante_libelle: string
  top_problemes: string[] | null
  top_opportunites: string[] | null
  actions_recommandees: string[] | null
  periode_debut: string
  periode_fin: string
  cree_le: string
}

function normaliser(ligne: LigneRapport): RapportHebdomadaire {
  return {
    id: ligne.id,
    santeBusiness: ligne.sante_business,
    santeLibelle: ligne.sante_libelle,
    topProblemes: ligne.top_problemes ?? [],
    topOpportunites: ligne.top_opportunites ?? [],
    actionsRecommandees: ligne.actions_recommandees ?? [],
    periodeDebut: ligne.periode_debut,
    periodeFin: ligne.periode_fin,
    creeLe: ligne.cree_le,
  }
}

function determinerSante(margePct: number, croissancePct: number): { sante: SanteBusiness; libelle: string } {
  if (margePct < 0) {
    return { sante: "critique", libelle: "Bénéfice net négatif sur la période." }
  }
  if (margePct < 10 || croissancePct < -10) {
    return { sante: "a_surveiller", libelle: "Marge ou croissance sous les seuils habituels." }
  }
  return { sante: "bonne", libelle: "Marge et croissance dans les seuils attendus." }
}

// Executive Agent : agrège les recommandations actives des autres agents
// (Publicité aujourd'hui, Rentabilité/Stock à venir au même endroit une fois
// qu'ils écriront aussi dans `recommendations`) avec les alertes stock et
// commandes bloquées déjà suivies au tableau de bord, en un rapport figé
// dans le temps — contrairement au Centre de décisions du tableau de bord
// qui se recalcule à chaque chargement de page.
export async function genererRapportHebdomadaire(
  organizationId: string,
  workspaceId: string
): Promise<RapportHebdomadaire> {
  const fin = new Date()
  const debut = new Date(fin.getTime() - 7 * 86400000)

  const [kpis, recommandations, alertesStock, commandesBloquees] = await Promise.all([
    obtenirResumeKpis(workspaceId, "7j"),
    listerRecommandationsActives(workspaceId),
    obtenirAlertesStock(workspaceId),
    obtenirCommandesBloquees(workspaceId),
  ])

  const { sante, libelle } = determinerSante(kpis?.margePct ?? 0, kpis?.croissancePct ?? 0)

  const problemesRecommandations = recommandations
    .filter((r) => r.impactEstimeEur === null || r.impactEstimeEur < 0)
    .map((r) => r.problemeDetecte)
  const opportunitesRecommandations = recommandations
    .filter((r) => r.impactEstimeEur !== null && r.impactEstimeEur >= 0)
    .map((r) => r.problemeDetecte)

  const topProblemes = [
    ...problemesRecommandations,
    ...alertesStock.map(
      (a) => `${a.products?.nom ?? "Un produit"} — ${a.type === "rupture" ? "rupture de stock" : "stock bas"}.`
    ),
    ...commandesBloquees.map((c) => `Commande ${c.numero_commande} bloquée (${c.montant_total}€).`),
  ].slice(0, 3)

  const topOpportunites = opportunitesRecommandations.slice(0, 3)
  const actionsRecommandees = recommandations.slice(0, 3).map((r) => r.recommandation)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("executive_weekly_reports")
    .insert({
      organization_id: organizationId,
      workspace_id: workspaceId,
      sante_business: sante,
      sante_libelle: libelle,
      top_problemes: topProblemes,
      top_opportunites: topOpportunites,
      actions_recommandees: actionsRecommandees,
      periode_debut: debut.toISOString(),
      periode_fin: fin.toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error("Impossible de générer le rapport hebdomadaire.")
  return normaliser(data as LigneRapport)
}

export async function obtenirDernierRapport(workspaceId: string): Promise<RapportHebdomadaire | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("executive_weekly_reports")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("cree_le", { ascending: false })
    .limit(1)
    .maybeSingle()

  return data ? normaliser(data as LigneRapport) : null
}
