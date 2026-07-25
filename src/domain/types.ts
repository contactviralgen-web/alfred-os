// Modèle de données normalisé (couche "Normalized Data Model" du document
// AI Commerce Intelligence). Ces types sont le contrat que les connectors
// remplissent et que l'engine/les agents consomment — jamais de type ad hoc
// dupliqué dans un service métier pour ces entités.

export type Company = {
  id: string
  nom: string
  slug: string
}

export type Product = {
  id: string
  sku: string
  asin: string | null
  nom: string
  categorie: string | null
  prixVente: number
  coutFournisseur: number
  fraisPlateformePct: number
}

export type Order = {
  id: string
  date: string
  productId: string
  canal: "site_web" | "amazon" | "manuel"
  montant: number
  quantite: number
}

export type AdvertisingCampaign = {
  id: string
  plateforme: "amazon_ads" | "meta_ads"
  nom: string
  depense: number
  clics: number
  conversions: number
  chiffreAffairesGenere: number
}

export type Inventory = {
  productId: string
  stockActuel: number
  ventesQuotidiennesMoyennes: number
  delaiFournisseurJours: number | null
}

export type AgentResponsable = "rentabilite" | "publicite" | "stock" | "directeur"
export type StatutRecommendation = "nouvelle" | "vue" | "appliquee" | "ignoree"

export type Recommendation = {
  id: string
  agent: AgentResponsable
  problemeDetecte: string
  analyse: string
  recommandation: string
  impactEstime: number | null
  statut: StatutRecommendation
  creeLe: string
}
