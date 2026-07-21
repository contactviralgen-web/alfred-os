import "server-only"

import { createClient } from "@/lib/supabase/server"

export type ResumeKpis = {
  caJour: number
  caVeille: number
  ca30j: number
  benefice30j: number
  margePct: number
  commandes30j: number
  panierMoyen30j: number
  croissancePct: number
}

export async function obtenirResumeKpis(workspaceId: string): Promise<ResumeKpis | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("revenue_metrics")
    .select("date, chiffre_affaires, benefice, nombre_commandes")
    .eq("workspace_id", workspaceId)
    .order("date", { ascending: false })
    .limit(60)

  if (!data || data.length === 0) return null

  const trente = data.slice(0, 30)
  const trentePrecedents = data.slice(30, 60)

  const somme = (lignes: typeof data, cle: "chiffre_affaires" | "benefice" | "nombre_commandes") =>
    lignes.reduce((total, ligne) => total + Number(ligne[cle]), 0)

  const ca30j = somme(trente, "chiffre_affaires")
  const ca30jPrecedent = somme(trentePrecedents, "chiffre_affaires")
  const benefice30j = somme(trente, "benefice")
  const commandes30j = somme(trente, "nombre_commandes")

  return {
    caJour: Number(data[0]?.chiffre_affaires ?? 0),
    caVeille: Number(data[1]?.chiffre_affaires ?? 0),
    ca30j,
    benefice30j,
    margePct: ca30j > 0 ? (benefice30j / ca30j) * 100 : 0,
    commandes30j,
    panierMoyen30j: commandes30j > 0 ? ca30j / commandes30j : 0,
    croissancePct: ca30jPrecedent > 0 ? ((ca30j - ca30jPrecedent) / ca30jPrecedent) * 100 : 0,
  }
}

export type PointCourbeCA = {
  date: string
  chiffreAffaires: number | null
  chiffreAffairesPrevu: number | null
}

export async function obtenirCourbeCA(workspaceId: string): Promise<PointCourbeCA[]> {
  const supabase = await createClient()

  const [{ data: historique }, { data: previsions }] = await Promise.all([
    supabase
      .from("revenue_metrics")
      .select("date, chiffre_affaires")
      .eq("workspace_id", workspaceId)
      .gte("date", new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10))
      .order("date", { ascending: true }),
    supabase
      .from("revenue_forecasts")
      .select("date, chiffre_affaires_prevu")
      .eq("workspace_id", workspaceId)
      .order("date", { ascending: true }),
  ])

  const points = new Map<string, PointCourbeCA>()

  for (const ligne of historique ?? []) {
    points.set(ligne.date, {
      date: ligne.date,
      chiffreAffaires: Number(ligne.chiffre_affaires),
      chiffreAffairesPrevu: null,
    })
  }

  for (const ligne of previsions ?? []) {
    points.set(ligne.date, {
      date: ligne.date,
      chiffreAffaires: null,
      chiffreAffairesPrevu: Number(ligne.chiffre_affaires_prevu),
    })
  }

  return Array.from(points.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export async function obtenirRepartitionCanaux(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("orders")
    .select("canal, montant_total")
    .eq("workspace_id", workspaceId)
    .neq("statut", "annulee")
    .gte("cree_le", new Date(Date.now() - 30 * 86400000).toISOString())

  const parCanal = new Map<string, number>()
  for (const ligne of data ?? []) {
    parCanal.set(ligne.canal, (parCanal.get(ligne.canal) ?? 0) + Number(ligne.montant_total))
  }

  return Array.from(parCanal.entries()).map(([canal, montant]) => ({ canal, montant }))
}
