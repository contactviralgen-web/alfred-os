// Démo Module 4 (Inventory Agent) : stock, vélocité de vente, délai fournisseur.

export type StockProduit = {
  nom: string
  stockActuel: number
  ventesJour: number
  delaiFournisseurJours: number
  statut: "ok" | "a-commander" | "rupture-imminente"
}

function joursDeCouverture(p: Pick<StockProduit, "stockActuel" | "ventesJour">) {
  return Math.round(p.stockActuel / p.ventesJour)
}

export const demoStockProduits: StockProduit[] = [
  { nom: "Kit rangement cuisine", stockActuel: 340, ventesJour: 14, delaiFournisseurJours: 18, statut: "ok" },
  { nom: "Thermos voyage 500ml", stockActuel: 96, ventesJour: 11, delaiFournisseurJours: 21, statut: "rupture-imminente" },
  { nom: "Organiseur tiroir x4", stockActuel: 210, ventesJour: 6, delaiFournisseurJours: 15, statut: "ok" },
  { nom: "Gourdes inox 750ml", stockActuel: 140, ventesJour: 9, delaiFournisseurJours: 25, statut: "a-commander" },
  { nom: "Set couteaux céramique", stockActuel: 58, ventesJour: 5, delaiFournisseurJours: 30, statut: "a-commander" },
]

export const demoStockAvecCouverture = demoStockProduits.map((p) => ({
  ...p,
  joursDeCouverture: joursDeCouverture(p),
}))
