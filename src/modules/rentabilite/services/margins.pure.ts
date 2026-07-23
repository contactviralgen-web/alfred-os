// Fonctions et types purs de Rentabilité, sans dépendance serveur — importable
// depuis un composant client (ex. affichage du prix plancher calculé en direct
// dans le tableau des charges), contrairement à margins.service.ts.

export type ReglagesCoutsProduit = {
  productId: string
  sku: string
  nom: string
  categorie: string | null
  prixAchat: number
  prixVente: number
  coutTransportFlat: number
  coutDouaneFlat: number
  fraisAmazonPct: number
  fraisFbaFlat: number
  fraisStockageUnitaireFlat: number
  tauxRetourPct: number
  coutDiversFlat: number
  margePlancherPct: number
}

// Prix de vente minimum pour respecter la marge plancher, calculé sur la même
// base que `calculerMargeLigne` (charges fixes par unité + charges
// proportionnelles au prix + TVA déduite du TTC). Sert de garde-fou pour le
// futur repricing automatique (Buy Box) : jamais descendre sous ce prix.
export function calculerPrixPlancher(params: {
  prixAchat: number
  coutTransportFlat: number
  coutDouaneFlat: number
  fraisFbaFlat: number
  fraisStockageUnitaireFlat: number
  coutDiversFlat: number
  fraisAmazonPct: number
  tauxRetourPct: number
  margePlancherPct: number
  tauxTvaPct: number
}): number {
  const chargesFixes =
    params.prixAchat +
    params.coutTransportFlat +
    params.coutDouaneFlat +
    params.fraisFbaFlat +
    params.fraisStockageUnitaireFlat +
    params.coutDiversFlat

  const tvaFactor = params.tauxTvaPct / 100 / (1 + params.tauxTvaPct / 100)
  const chargesProportionnellesFactor = (params.fraisAmazonPct + params.tauxRetourPct) / 100
  const facteurRestant = 1 - chargesProportionnellesFactor - tvaFactor - params.margePlancherPct / 100

  if (facteurRestant <= 0) return Infinity
  return chargesFixes / facteurRestant
}
