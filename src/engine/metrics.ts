// Business Intelligence Engine — Metrics.
// Marge brute, ROAS, ACOS, TACOS, rotation stock : mêmes formules partout,
// que ce soit affiché dans l'UI ou lu par un agent IA pour générer une
// recommandation. Fonctions pures, aucun accès base de données ici.

export function calculerMargeBrutePct(chiffreAffaires: number, coutProduit: number): number {
  return chiffreAffaires > 0 ? ((chiffreAffaires - coutProduit) / chiffreAffaires) * 100 : 0
}

// ROAS = CA généré / dépense publicitaire. 0 si aucune dépense (pas de
// division par zéro qui remonterait jusqu'à l'UI).
export function calculerRoas(chiffreAffairesGenere: number, depense: number): number {
  return depense > 0 ? Math.round((chiffreAffairesGenere / depense) * 100) / 100 : 0
}

// ACOS = dépense / CA généré, en %.
export function calculerAcosPct(chiffreAffairesGenere: number, depense: number): number {
  return chiffreAffairesGenere > 0 ? Math.round((depense / chiffreAffairesGenere) * 10000) / 100 : 0
}

// TACOS = dépense publicitaire totale / CA total du workspace (tous canaux,
// pas seulement les ventes attribuées aux campagnes) — c'est ce qui le
// distingue de l'ACOS par campagne.
export function calculerTacosPct(depenseTotale: number, chiffreAffairesTotal: number): number {
  return chiffreAffairesTotal > 0 ? Math.round((depenseTotale / chiffreAffairesTotal) * 10000) / 100 : 0
}

// Rotation stock = unités vendues sur la période / stock moyen sur la même
// période. Une rotation basse signale un surstock, une rotation très haute
// signale un risque de rupture prochaine (utilisé par l'Agent Stock).
export function calculerRotationStock(unitesVenduesPeriode: number, stockMoyenPeriode: number): number {
  return stockMoyenPeriode > 0 ? Math.round((unitesVenduesPeriode / stockMoyenPeriode) * 100) / 100 : 0
}

// Point de réapprovisionnement : combien de jours avant rupture au rythme de
// vente actuel, comparé au délai de livraison fournisseur. Utilisé par
// l'Agent Stock pour répondre à "quand commander ?".
export function calculerJoursAvantRupture(stockActuel: number, ventesQuotidiennesMoyennes: number): number | null {
  if (ventesQuotidiennesMoyennes <= 0) return null
  return Math.floor(stockActuel / ventesQuotidiennesMoyennes)
}
