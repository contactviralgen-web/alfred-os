// Données de démonstration statiques — remplacées par de vraies requêtes
// (Profit Engine + agents) une fois le modèle de données métier construit.

export type KpiTrend = "up" | "down"

export type Kpi = {
  label: string
  value: string
  trend: KpiTrend
  trendLabel: string
  positiveIsUp: boolean
}

export const demoKpis: Kpi[] = [
  {
    label: "Profit net (30 jours)",
    value: "18 420 €",
    trend: "up",
    trendLabel: "+12,4 % vs mois dernier",
    positiveIsUp: true,
  },
  {
    label: "Chiffre d'affaires",
    value: "94 650 €",
    trend: "up",
    trendLabel: "+6,1 % vs mois dernier",
    positiveIsUp: true,
  },
  {
    label: "ACOS moyen",
    value: "24,8 %",
    trend: "down",
    trendLabel: "-3,2 pts vs mois dernier",
    positiveIsUp: false,
  },
  {
    label: "Marge nette",
    value: "19,5 %",
    trend: "down",
    trendLabel: "-1,1 pt vs mois dernier",
    positiveIsUp: false,
  },
]

export type Recommendation = {
  agent: string
  titre: string
  detail: string
  impact: string
  severite: "positive" | "negative"
}

export const demoRecommendations: Recommendation[] = [
  {
    agent: "Agent Publicité",
    titre: "Campagne \"Gourdes inox 750ml\" en ACOS 61 %",
    detail: "Budget publicitaire disproportionné par rapport à la marge produit. Réduire de 40 % ou couper.",
    impact: "+2 100 €/mois estimé",
    severite: "negative",
  },
  {
    agent: "Agent Profit",
    titre: "\"Kit rangement cuisine\" sous-exploité",
    detail: "Marge nette de 34 % mais budget pub quasi nul. Fort potentiel de scale.",
    impact: "+3 400 €/mois estimé",
    severite: "positive",
  },
  {
    agent: "Agent Stock",
    titre: "Rupture prévue sous 12 jours",
    detail: "\"Thermos voyage 500ml\" — délai fournisseur de 21 jours. Commander maintenant.",
    impact: "Risque de rupture",
    severite: "negative",
  },
]

export type TopProduct = {
  nom: string
  ca: string
  margeNette: string
  tendance: KpiTrend
}

export const demoTopProduits: TopProduct[] = [
  { nom: "Kit rangement cuisine", ca: "21 300 €", margeNette: "34 %", tendance: "up" },
  { nom: "Thermos voyage 500ml", ca: "18 900 €", margeNette: "28 %", tendance: "up" },
  { nom: "Gourdes inox 750ml", ca: "14 200 €", margeNette: "6 %", tendance: "down" },
  { nom: "Organiseur tiroir x4", ca: "9 800 €", margeNette: "31 %", tendance: "up" },
]
