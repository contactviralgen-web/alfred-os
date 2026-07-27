// Démo Agent Financier — Repricer automatique : avant de baisser un prix pour
// reprendre la Buy Box, l'agent vérifie que la marge nette projetée reste
// au-dessus de la marge plancher configurée dans Paramètres > Entreprise.

export type PriceRecommendation = {
  produit: string
  asin: string
  prixActuel: number
  prixConcurrent: number
  prixPropose: number
  margeProjetee: number
}

export const demoPriceRecommendations: PriceRecommendation[] = [
  { produit: "Kit rangement cuisine", asin: "B0C4K8XJ2P", prixActuel: 34.9, prixConcurrent: 33.5, prixPropose: 33.9, margeProjetee: 0.398 },
  { produit: "Thermos voyage 500ml", asin: "B0D1M9YQ7T", prixActuel: 24.9, prixConcurrent: 23.9, prixPropose: 24.2, margeProjetee: 0.295 },
  { produit: "Organiseur tiroir x4", asin: "B0B7T3RW9L", prixActuel: 19.9, prixConcurrent: 19.9, prixPropose: 19.9, margeProjetee: 0.411 },
  { produit: "Gourdes inox 750ml", asin: "B0C9F2QK4X", prixActuel: 17.9, prixConcurrent: 15.9, prixPropose: 15.9, margeProjetee: -0.035 },
  { produit: "Set couteaux céramique", asin: "B0DA5H8N3M", prixActuel: 22.9, prixConcurrent: 21.2, prixPropose: 21.2, margeProjetee: 0.015 },
]

export const DEFAULT_FLOOR_MARGIN_PCT = 15
