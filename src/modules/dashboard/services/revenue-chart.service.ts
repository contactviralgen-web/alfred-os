import "server-only"

import { createClient } from "@/lib/supabase/server"
import {
  calculerMargeLigne,
  obtenirEvolutionMarge,
  obtenirLignesMarges,
} from "@/modules/rentabilite/services/margins.service"

export {
  plageDatesPeriode,
  LIBELLE_PERIODE,
  type PeriodeGraphique,
  type MetriqueGraphique,
  type PointGraphique,
} from "@/modules/dashboard/services/revenue-chart.types"
import type { PeriodeGraphique, MetriqueGraphique, PointGraphique } from "@/modules/dashboard/services/revenue-chart.types"

async function obtenirPoints24h(
  workspaceId: string,
  metrique: MetriqueGraphique
): Promise<PointGraphique[]> {
  const debut = new Date(Date.now() - 24 * 3600000)
  const parHeure = new Map<number, number>()

  if (metrique === "ca") {
    const supabase = await createClient()
    const { data } = await supabase
      .from("orders")
      .select("cree_le, montant_total")
      .eq("workspace_id", workspaceId)
      .neq("statut", "annulee")
      .gte("cree_le", debut.toISOString())
    for (const ligne of data ?? []) {
      const heure = new Date(ligne.cree_le).getHours()
      parHeure.set(heure, (parHeure.get(heure) ?? 0) + Number(ligne.montant_total))
    }
  } else {
    const lignes = await obtenirLignesMarges(workspaceId, {
      debut: debut.toISOString(),
      fin: new Date().toISOString(),
    })
    for (const ligne of lignes) {
      const heure = new Date(ligne.cree_le).getHours()
      parHeure.set(heure, (parHeure.get(heure) ?? 0) + calculerMargeLigne(ligne).margeNette)
    }
  }

  return Array.from({ length: 24 }, (_, heure) => ({
    date: String(heure),
    libelle: `${heure}h`,
    valeur: Math.round(parHeure.get(heure) ?? 0),
    valeurPrevue: null,
  }))
}

async function obtenirPointsCaAgrege(workspaceId: string, nbJours: number): Promise<PointGraphique[]> {
  const supabase = await createClient()
  const debut = new Date(Date.now() - nbJours * 86400000).toISOString().slice(0, 10)

  const [{ data: historique }, { data: previsions }] = await Promise.all([
    supabase
      .from("revenue_metrics")
      .select("date, chiffre_affaires")
      .eq("workspace_id", workspaceId)
      .gte("date", debut)
      .order("date", { ascending: true }),
    nbJours <= 30
      ? supabase
          .from("revenue_forecasts")
          .select("date, chiffre_affaires_prevu")
          .eq("workspace_id", workspaceId)
          .order("date", { ascending: true })
      : Promise.resolve({ data: [] as { date: string; chiffre_affaires_prevu: number }[] }),
  ])

  const points = new Map<string, PointGraphique>()
  for (const ligne of historique ?? []) {
    points.set(ligne.date, {
      date: ligne.date,
      libelle: ligne.date,
      valeur: Number(ligne.chiffre_affaires),
      valeurPrevue: null,
    })
  }
  for (const ligne of previsions ?? []) {
    points.set(ligne.date, {
      date: ligne.date,
      libelle: ligne.date,
      valeur: points.get(ligne.date)?.valeur ?? 0,
      valeurPrevue: Number(ligne.chiffre_affaires_prevu),
    })
  }
  return Array.from(points.values()).sort((a, b) => a.date.localeCompare(b.date))
}

async function obtenirPointsBeneficeAgrege(
  workspaceId: string,
  granularite: "jour" | "mois",
  nbJours: number
): Promise<PointGraphique[]> {
  const debut = new Date(Date.now() - nbJours * 86400000).toISOString()
  const fin = new Date().toISOString()
  const evolution = await obtenirEvolutionMarge(workspaceId, granularite, { debut, fin })
  return evolution.map((p) => ({
    date: p.date,
    libelle: p.date,
    valeur: Math.round(p.margeNette),
    valeurPrevue: null,
  }))
}

// Routeur : 24h calculé à la volée depuis les commandes, 7j/mois depuis les
// agrégats journaliers (revenue_metrics ou marge nette réelle du module
// Rentabilité), année agrégée par mois sur 12 mois.
export async function obtenirPointsGraphique(
  workspaceId: string,
  periode: PeriodeGraphique,
  metrique: MetriqueGraphique
): Promise<PointGraphique[]> {
  if (periode === "24h") return obtenirPoints24h(workspaceId, metrique)

  const nbJours = periode === "7j" ? 7 : periode === "mois" ? 30 : 365

  if (metrique === "ca") {
    if (periode !== "annee") return obtenirPointsCaAgrege(workspaceId, nbJours)
    // Année : agrège les agrégats journaliers par mois côté JS.
    const points = await obtenirPointsCaAgrege(workspaceId, nbJours)
    const parMois = new Map<string, number>()
    for (const p of points) {
      const mois = p.date.slice(0, 7)
      parMois.set(mois, (parMois.get(mois) ?? 0) + p.valeur)
    }
    return Array.from(parMois.entries())
      .map(([date, valeur]) => ({ date, libelle: date, valeur, valeurPrevue: null }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  return obtenirPointsBeneficeAgrege(workspaceId, periode === "annee" ? "mois" : "jour", nbJours)
}
