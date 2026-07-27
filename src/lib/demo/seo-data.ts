// Démo Agent Marketing — Optimisation SEO : mots-clés réels (Search Query
// Performance) sur vos propres produits, et optimisation de fiche par l'IA.

export type KeywordPerformance = {
  keyword: string
  produit: string
  volumeRecherche: number
  impressions: number
  clics: number
  partAchat: number
  tendance: "up" | "down"
}

export const demoKeywordPerformance: KeywordPerformance[] = [
  { keyword: "kit rangement cuisine", produit: "Kit rangement cuisine", volumeRecherche: 6100, impressions: 38000, clics: 2100, partAchat: 0.34, tendance: "up" },
  { keyword: "organisateur placard cuisine", produit: "Kit rangement cuisine", volumeRecherche: 3200, impressions: 14000, clics: 780, partAchat: 0.21, tendance: "up" },
  { keyword: "thermos voyage inox", produit: "Thermos voyage 500ml", volumeRecherche: 4800, impressions: 26000, clics: 900, partAchat: 0.15, tendance: "down" },
  { keyword: "gourde inox 750ml", produit: "Gourdes inox 750ml", volumeRecherche: 8200, impressions: 45000, clics: 1200, partAchat: 0.09, tendance: "down" },
  { keyword: "gourde sport isotherme", produit: "Gourdes inox 750ml", volumeRecherche: 5400, impressions: 21000, clics: 640, partAchat: 0.11, tendance: "up" },
]

export type ListingOptimization = {
  produit: string
  asin: string
  motsClesAjoutes: string[]
  actuel: {
    titre: string
    bullets: string[]
    description: string
  }
  suggere: {
    titre: string
    bullets: string[]
    description: string
  }
}

export const demoListingOptimization: ListingOptimization = {
  produit: "Gourdes inox 750ml",
  asin: "B0C9F2QK4X",
  motsClesAjoutes: ["gourde sport isotherme", "gourde inox 750ml", "sans bpa"],
  actuel: {
    titre: "Gourde inox 750ml",
    bullets: [
      "Gourde en acier inoxydable",
      "Contenance 750ml",
      "Bouchon étanche",
    ],
    description:
      "Gourde pratique pour vos déplacements. Résistante et facile à nettoyer.",
  },
  suggere: {
    titre: "Gourde Inox 750ml Isotherme Sport - Sans BPA, Garde le Froid 24h et le Chaud 12h",
    bullets: [
      "ISOTHERME LONGUE DURÉE — garde vos boissons fraîches jusqu'à 24h et chaudes jusqu'à 12h grâce à sa double paroi en inox 18/8",
      "SANS BPA ET SANS GOÛT — acier inoxydable alimentaire, ne transfère aucune odeur ni arrière-goût contrairement au plastique",
      "GOURDE SPORT 750ML — le format idéal pour la salle de sport, la randonnée ou le bureau, tient dans la plupart des porte-gourdes",
      "BOUCHON ÉTANCHE ANTI-FUITE — testé pour un transport sans fuite dans votre sac",
      "FACILE À NETTOYER — large ouverture compatible goupillon, résiste au lave-vaisselle",
    ],
    description:
      "Cette gourde inox isotherme 750ml a été conçue pour les sportifs et les actifs qui veulent une boisson à la bonne température toute la journée, sans plastique ni BPA. Sa double paroi en acier inoxydable 18/8 garde le froid jusqu'à 24h et le chaud jusqu'à 12h. Compatible sac de sport, vélo et porte-gourde voiture standard.",
  },
}
