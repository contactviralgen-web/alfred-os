// Démo Module 3 (Business Engine) : Revenue - Coût produit - Frais plateforme
// - Publicité - Logistique - Retours = Profit réel.

export type ProduitRentabilite = {
  nom: string
  asin: string
  ca: number
  coutProduit: number
  fraisPlateforme: number
  depensesPub: number
  logistique: number
  retours: number
  margeNette: number
}

function profitReel(p: Omit<ProduitRentabilite, "margeNette">) {
  return p.ca - p.coutProduit - p.fraisPlateforme - p.depensesPub - p.logistique - p.retours
}

const base: Omit<ProduitRentabilite, "margeNette">[] = [
  { nom: "Kit rangement cuisine", asin: "B0C4K8XJ2P", ca: 21300, coutProduit: 6390, fraisPlateforme: 3195, depensesPub: 1050, logistique: 1280, retours: 320 },
  { nom: "Thermos voyage 500ml", asin: "B0D1M9YQ7T", ca: 18900, coutProduit: 6615, fraisPlateforme: 2835, depensesPub: 1890, logistique: 950, retours: 410 },
  { nom: "Organiseur tiroir x4", asin: "B0B7T3RW9L", ca: 9800, coutProduit: 2940, fraisPlateforme: 1470, depensesPub: 780, logistique: 490, retours: 90 },
  { nom: "Gourdes inox 750ml", asin: "B0C9F2QK4X", ca: 14200, coutProduit: 5680, fraisPlateforme: 2130, depensesPub: 4600, logistique: 710, retours: 940 },
  { nom: "Set couteaux céramique", asin: "B0DA5H8N3M", ca: 7400, coutProduit: 2960, fraisPlateforme: 1110, depensesPub: 2350, logistique: 370, retours: 610 },
]

export const demoRentabiliteProduits: ProduitRentabilite[] = base.map((p) => ({
  ...p,
  margeNette: profitReel(p),
}))

export const demoRentabiliteResume = {
  caTotal: demoRentabiliteProduits.reduce((s, p) => s + p.ca, 0),
  profitTotal: demoRentabiliteProduits.reduce((s, p) => s + p.margeNette, 0),
  margeMoyenne:
    demoRentabiliteProduits.reduce((s, p) => s + p.margeNette / p.ca, 0) /
    demoRentabiliteProduits.length,
}
