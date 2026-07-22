import "server-only"

import { createClient } from "@/lib/supabase/server"
import { obtenirBeneficeTotalPeriode } from "@/modules/rentabilite/services/margins.service"
import { plageDatesPeriode, type PeriodeGraphique } from "@/modules/dashboard/services/revenue-chart.service"

export type ResumeKpis = {
  ca: number
  benefice: number
  margePct: number
  commandes: number
  panierMoyen: number
  croissancePct: number
}

export async function obtenirResumeKpis(
  workspaceId: string,
  periode: PeriodeGraphique
): Promise<ResumeKpis | null> {
  const supabase = await createClient()
  const { debut, fin, debutPrecedent, finPrecedent } = plageDatesPeriode(periode)

  const [{ data: courante }, { data: precedente }, { margeNette: benefice }] = await Promise.all([
    supabase
      .from("orders")
      .select("montant_total")
      .eq("workspace_id", workspaceId)
      .neq("statut", "annulee")
      .gte("cree_le", debut)
      .lt("cree_le", fin),
    supabase
      .from("orders")
      .select("montant_total")
      .eq("workspace_id", workspaceId)
      .neq("statut", "annulee")
      .gte("cree_le", debutPrecedent)
      .lt("cree_le", finPrecedent),
    obtenirBeneficeTotalPeriode(workspaceId, { debut, fin }),
  ])

  if (!courante || courante.length === 0) return null

  const ca = courante.reduce((total, o) => total + Number(o.montant_total), 0)
  const caPrecedent = (precedente ?? []).reduce((total, o) => total + Number(o.montant_total), 0)
  const commandes = courante.length

  return {
    ca,
    benefice,
    margePct: ca > 0 ? (benefice / ca) * 100 : 0,
    commandes,
    panierMoyen: commandes > 0 ? ca / commandes : 0,
    croissancePct: caPrecedent > 0 ? ((ca - caPrecedent) / caPrecedent) * 100 : 0,
  }
}

export async function obtenirRepartitionCanaux(workspaceId: string, periode: PeriodeGraphique) {
  const supabase = await createClient()
  const { debut, fin } = plageDatesPeriode(periode)
  const { data } = await supabase
    .from("orders")
    .select("canal, montant_total")
    .eq("workspace_id", workspaceId)
    .neq("statut", "annulee")
    .gte("cree_le", debut)
    .lt("cree_le", fin)

  const parCanal = new Map<string, number>()
  for (const ligne of data ?? []) {
    parCanal.set(ligne.canal, (parCanal.get(ligne.canal) ?? 0) + Number(ligne.montant_total))
  }

  return Array.from(parCanal.entries()).map(([canal, montant]) => ({ canal, montant }))
}
