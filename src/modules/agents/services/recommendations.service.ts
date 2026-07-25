import "server-only"

import { createClient } from "@/lib/supabase/server"

export type TypeAgentIA = "rentabilite" | "publicite" | "stock" | "directeur"
export type StatutRecommandation = "nouvelle" | "vue" | "appliquee" | "ignoree"

export type Recommandation = {
  id: string
  agent: TypeAgentIA
  problemeDetecte: string
  analyseIa: string
  recommandation: string
  impactEstimeEur: number | null
  statut: StatutRecommandation
  creeLe: string
}

type LigneRecommendation = {
  id: string
  agent: TypeAgentIA
  probleme_detecte: string
  analyse_ia: string
  recommandation: string
  impact_estime_eur: number | string | null
  statut: StatutRecommandation
  cree_le: string
}

function normaliser(ligne: LigneRecommendation): Recommandation {
  return {
    id: ligne.id,
    agent: ligne.agent,
    problemeDetecte: ligne.probleme_detecte,
    analyseIa: ligne.analyse_ia,
    recommandation: ligne.recommandation,
    impactEstimeEur: ligne.impact_estime_eur === null ? null : Number(ligne.impact_estime_eur),
    statut: ligne.statut,
    creeLe: ligne.cree_le,
  }
}

export async function enregistrerRecommandation(
  organizationId: string,
  workspaceId: string,
  donnees: {
    agent: TypeAgentIA
    problemeDetecte: string
    analyseIa: string
    recommandation: string
    impactEstimeEur?: number | null
  }
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("recommendations")
    .insert({
      organization_id: organizationId,
      workspace_id: workspaceId,
      agent: donnees.agent,
      probleme_detecte: donnees.problemeDetecte,
      analyse_ia: donnees.analyseIa,
      recommandation: donnees.recommandation,
      impact_estime_eur: donnees.impactEstimeEur ?? null,
    })
    .select()
    .single()

  if (error) throw new Error("Impossible d'enregistrer la recommandation.")
  return normaliser(data as LigneRecommendation)
}

export async function listerRecommandationsActives(
  workspaceId: string,
  agent?: TypeAgentIA
): Promise<Recommandation[]> {
  const supabase = await createClient()
  let requete = supabase
    .from("recommendations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .neq("statut", "ignoree")
    .order("cree_le", { ascending: false })
  if (agent) requete = requete.eq("agent", agent)

  const { data } = await requete
  return (data ?? []).map((ligne) => normaliser(ligne as LigneRecommendation))
}

export async function marquerStatutRecommandation(id: string, statut: StatutRecommandation) {
  const supabase = await createClient()
  const { error } = await supabase.from("recommendations").update({ statut }).eq("id", id)
  if (error) throw new Error("Impossible de mettre à jour le statut de la recommandation.")
}
