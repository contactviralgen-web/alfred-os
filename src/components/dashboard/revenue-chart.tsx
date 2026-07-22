"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { ForecastBadge } from "@/components/dashboard/forecast-badge"
import { AiInsightPanel } from "@/components/agents/ai-insight-panel"
import type {
  MetriqueGraphique,
  PeriodeGraphique,
  PointGraphique,
} from "@/modules/dashboard/services/revenue-chart.types"
import { LIBELLE_PERIODE } from "@/modules/dashboard/services/revenue-chart.types"
import type { InsightIA } from "@/modules/agents/services/insights.service"

const formateurCompact = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
})
const formateurExact = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

function config(metrique: MetriqueGraphique): ChartConfig {
  return {
    valeur: {
      label: metrique === "ca" ? "Chiffre d'affaires" : "Bénéfice net réel",
      color: "var(--chart-1)",
    },
    valeurPrevue: { label: "Prévision", color: "var(--chart-2)" },
  }
}

function formaterAxeDate(periode: PeriodeGraphique, valeur: string) {
  if (periode === "24h") {
    const heure = Number(valeur)
    return heure % 3 === 0 ? `${heure}h` : ""
  }
  if (periode === "annee") return new Date(valeur).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
  return new Date(valeur).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

export function RevenueChart({
  donnees,
  periode,
  metrique,
  insight,
}: {
  donnees: PointGraphique[]
  periode: PeriodeGraphique
  metrique: MetriqueGraphique
  insight: InsightIA
}) {
  const afficherPrevision = metrique === "ca" && (periode === "7j" || periode === "mois")

  return (
    <Card className="border border-border/60 p-4 shadow-none ring-0 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div>
          <p className="text-base font-bold tracking-tight">
            {metrique === "ca" ? "Chiffre d'affaires" : "Bénéfice net réel"}
          </p>
          <p className="text-xs text-muted-foreground">{LIBELLE_PERIODE[periode]}</p>
        </div>
        {afficherPrevision ? <ForecastBadge /> : null}
      </div>
      {/* Barres pour la valeur réalisée : chaque point est un total agrégé
          par période (heure/jour/mois), pas une quantité continue — un
          barchart représente cette réalité mieux qu'une aire/ligne lissée,
          et gère naturellement les valeurs négatives en mode Bénéfice. La
          prévision reste une ligne, cohérente avec le fait que c'est une
          projection et non une valeur réalisée. */}
      <ChartContainer config={config(metrique)} className="mt-4 aspect-auto h-72 w-full">
        <ComposedChart data={donnees} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeOpacity={0.35} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            tick={{ fontSize: 12 }}
            tickFormatter={(value: string) => formaterAxeDate(periode, value)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={56}
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => formateurCompact.format(value)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => formaterAxeDate(periode, value) || value}
                formatter={(value, name) => [
                  formateurExact.format(Number(value)),
                  name === "valeurPrevue" ? "Prévision" : config(metrique).valeur.label,
                ]}
                indicator="dot"
              />
            }
          />
          <Bar dataKey="valeur" fill="var(--color-valeur)" radius={[3, 3, 0, 0]} maxBarSize={28} />
          {afficherPrevision ? (
            <Line
              dataKey="valeurPrevue"
              type="monotone"
              stroke="var(--color-valeurPrevue)"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
            />
          ) : null}
        </ComposedChart>
      </ChartContainer>
      <AiInsightPanel insight={insight} />
    </Card>
  )
}
