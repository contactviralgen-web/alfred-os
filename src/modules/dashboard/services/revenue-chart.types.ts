// Types et constantes purs (pas de dépendance "server-only"/Supabase) pour
// que les composants client (boutons de filtre, libellés) puissent les
// importer sans tirer accidentellement le code d'accès DB dans le bundle
// navigateur.

export type PeriodeGraphique = "24h" | "7j" | "mois" | "annee"
export type MetriqueGraphique = "ca" | "benefice"
export type PointGraphique = { date: string; libelle: string; valeur: number; valeurPrevue: number | null }

const NB_JOURS_PERIODE: Record<PeriodeGraphique, number> = { "24h": 1, "7j": 7, mois: 30, annee: 365 }

export const LIBELLE_PERIODE: Record<PeriodeGraphique, string> = {
  "24h": "24 dernières heures",
  "7j": "7 derniers jours",
  mois: "30 derniers jours",
  annee: "12 derniers mois",
}

// Plage de la période sélectionnée + plage de la période précédente de même
// durée (pour calculer une variation %), réutilisée par les KPIs et la
// répartition par canal en plus du graphique.
export function plageDatesPeriode(periode: PeriodeGraphique) {
  const nbJours = NB_JOURS_PERIODE[periode]
  const maintenant = Date.now()
  const debut = new Date(maintenant - nbJours * 86400000)
  const debutPrecedent = new Date(maintenant - nbJours * 2 * 86400000)
  return {
    debut: debut.toISOString(),
    fin: new Date(maintenant).toISOString(),
    debutPrecedent: debutPrecedent.toISOString(),
    finPrecedent: debut.toISOString(),
  }
}
