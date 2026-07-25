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

export type Period = "24h" | "mois" | "annee"

export const PERIOD_ORDER: Period[] = ["24h", "mois", "annee"]

export const PERIOD_LABELS: Record<Period, string> = {
  "24h": "Dernières 24h",
  mois: "Dernier mois",
  annee: "Dernière année",
}

export type MetricKey = "ca" | "profit" | "marge" | "acos"

export const METRIC_ORDER: MetricKey[] = ["ca", "profit", "marge", "acos"]

export const METRIC_LABELS: Record<MetricKey, string> = {
  ca: "Chiffre d'affaires",
  profit: "Profit net",
  marge: "Marge nette",
  acos: "ACOS moyen",
}

// Une métrique est en euros (ca, profit) ou en pourcentage (marge, acos).
const PERCENT_METRICS = new Set<MetricKey>(["marge", "acos"])

// Une hausse est une bonne nouvelle pour ca/profit/marge, une mauvaise pour acos.
const POSITIVE_IS_UP: Record<MetricKey, boolean> = {
  ca: true,
  profit: true,
  marge: true,
  acos: false,
}

const eurFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })

function formatNumber(n: number, decimals = 1) {
  return n.toFixed(decimals).replace(".", ",")
}

export function formatMetricValue(metric: MetricKey, value: number): string {
  if (PERCENT_METRICS.has(metric)) {
    return `${formatNumber(value * 100)} %`
  }
  return `${eurFormatter.format(Math.round(value))} €`
}

export function formatMetricTrend(metric: MetricKey, trendPct: number): string {
  const sign = trendPct >= 0 ? "+" : ""
  const unit = PERCENT_METRICS.has(metric) ? "pt" : "%"
  return `${sign}${formatNumber(trendPct)} ${unit} vs période précédente`
}

export type TrendPoint = {
  label: string
  ca: number
  profit: number
  marge: number
  acos: number
}

export const demoTendanceByPeriod: Record<Period, TrendPoint[]> = {
  "24h": [
    { label: "00h", ca: 420, profit: 78, marge: 0.186, acos: 0.27 },
    { label: "04h", ca: 180, profit: 30, marge: 0.167, acos: 0.29 },
    { label: "08h", ca: 610, profit: 118, marge: 0.193, acos: 0.25 },
    { label: "12h", ca: 890, profit: 175, marge: 0.197, acos: 0.24 },
    { label: "16h", ca: 740, profit: 142, marge: 0.192, acos: 0.25 },
    { label: "20h", ca: 340, profit: 67, marge: 0.197, acos: 0.243 },
  ],
  mois: [
    { label: "S1", ca: 19200, profit: 3100, marge: 0.161, acos: 0.29 },
    { label: "S2", ca: 20800, profit: 3450, marge: 0.166, acos: 0.28 },
    { label: "S3", ca: 21100, profit: 3300, marge: 0.156, acos: 0.27 },
    { label: "S4", ca: 22400, profit: 3900, marge: 0.174, acos: 0.26 },
    { label: "S5", ca: 23050, profit: 4050, marge: 0.176, acos: 0.25 },
    { label: "S6", ca: 22700, profit: 3700, marge: 0.163, acos: 0.26 },
    { label: "S7", ca: 24300, profit: 4200, marge: 0.173, acos: 0.24 },
    { label: "S8", ca: 25100, profit: 4620, marge: 0.184, acos: 0.243 },
  ],
  annee: [
    { label: "Août", ca: 61200, profit: 9800, marge: 0.16, acos: 0.3 },
    { label: "Sept", ca: 68400, profit: 11200, marge: 0.164, acos: 0.29 },
    { label: "Oct", ca: 74100, profit: 12500, marge: 0.169, acos: 0.28 },
    { label: "Nov", ca: 96800, profit: 17400, marge: 0.18, acos: 0.26 },
    { label: "Déc", ca: 118500, profit: 22100, marge: 0.186, acos: 0.25 },
    { label: "Jan", ca: 82300, profit: 14600, marge: 0.177, acos: 0.26 },
    { label: "Fév", ca: 79600, profit: 13900, marge: 0.175, acos: 0.27 },
    { label: "Mars", ca: 85200, profit: 15300, marge: 0.18, acos: 0.26 },
    { label: "Avr", ca: 88900, profit: 16100, marge: 0.181, acos: 0.25 },
    { label: "Mai", ca: 91400, profit: 16800, marge: 0.184, acos: 0.25 },
    { label: "Juin", ca: 93700, profit: 17600, marge: 0.188, acos: 0.24 },
    { label: "Juil", ca: 94650, profit: 18420, marge: 0.195, acos: 0.248 },
  ],
}

export type MetricStat = {
  value: number
  trend: number
  positiveIsUp: boolean
}

export type PeriodStats = Record<MetricKey, MetricStat>

function buildStats(points: TrendPoint[]): PeriodStats {
  const curr = points[points.length - 1]
  const prev = points[points.length - 2]

  const trendFor = (metric: MetricKey) => {
    if (PERCENT_METRICS.has(metric)) {
      return (curr[metric] - prev[metric]) * 100
    }
    return ((curr[metric] - prev[metric]) / prev[metric]) * 100
  }

  return METRIC_ORDER.reduce((acc, metric) => {
    acc[metric] = {
      value: curr[metric],
      trend: trendFor(metric),
      positiveIsUp: POSITIVE_IS_UP[metric],
    }
    return acc
  }, {} as PeriodStats)
}

export const demoStatsByPeriod: Record<Period, PeriodStats> = {
  "24h": buildStats(demoTendanceByPeriod["24h"]),
  mois: buildStats(demoTendanceByPeriod.mois),
  annee: buildStats(demoTendanceByPeriod.annee),
}

export function metricToKpi(metric: MetricKey, stat: MetricStat): Kpi {
  return {
    label: METRIC_LABELS[metric],
    value: formatMetricValue(metric, stat.value),
    trend: stat.trend >= 0 ? "up" : "down",
    trendLabel: formatMetricTrend(metric, stat.trend),
    positiveIsUp: stat.positiveIsUp,
  }
}

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
