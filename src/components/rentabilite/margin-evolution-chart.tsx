"use client"

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { AiInsightPanel } from "@/components/agents/ai-insight-panel"
import type { PointEvolutionMarge } from "@/modules/rentabilite/services/margins.service"
import type { InsightIA } from "@/modules/agents/services/insights.service"

const config = {
  chiffreAffaires: { label: "CA", color: "var(--chart-2)" },
  margeNette: { label: "Marge nette réelle", color: "var(--chart-1)" },
} satisfies ChartConfig

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

export function MarginEvolutionChart({
  donnees,
  insight,
}: {
  donnees: PointEvolutionMarge[]
  insight: InsightIA
}) {
  return (
    <Card className="border border-border/60 p-4 shadow-none ring-0 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="px-2">
        <p className="text-base font-bold tracking-tight">Évolution de la marge nette</p>
        <p className="text-xs text-muted-foreground">
          6 derniers mois — CA (ligne de référence) vs marge réelle après charges (barres)
        </p>
      </div>
      {/* Marge nette en barres sur l'axe principal gauche (échelle adaptée à
          ses propres valeurs) : c'est la métrique à lire précisément mois par
          mois, y compris négative. CA en ligne de contexte sur un axe
          secondaire à DROITE (orientation explicite — deux axes "left"
          implicites se marchaient dessus et masquaient les ticks, cause du
          bug de lisibilité) — masqué visuellement mais toujours dimensionné
          correctement grâce à cette séparation. */}
      <ChartContainer config={config} className="mt-4 aspect-auto h-80 w-full">
        <ComposedChart data={donnees} margin={{ left: 0, right: 8, top: 8 }} barCategoryGap="15%">
          <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
            }
          />
          <YAxis
            yAxisId="marge"
            orientation="left"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={60}
            tick={{ fontSize: 12 }}
            domain={([min, max]: readonly [number, number]): [number, number] => [
              Math.min(0, min),
              Math.max(0, max),
            ]}
            tickFormatter={(value: number) => formateurCompact.format(value)}
          />
          <YAxis yAxisId="ca" orientation="right" hide width={0} domain={["auto", "auto"]} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
                }
                formatter={(value, name) => [
                  formateurExact.format(Number(value)),
                  name === "chiffreAffaires" ? "CA" : "Marge nette réelle",
                ]}
                indicator="dot"
              />
            }
          />
          <Line
            yAxisId="ca"
            dataKey="chiffreAffaires"
            type="monotone"
            stroke="var(--color-chiffreAffaires)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
          <Bar
            yAxisId="marge"
            dataKey="margeNette"
            fill="var(--color-margeNette)"
            radius={[4, 4, 0, 0]}
            maxBarSize={70}
          />
        </ComposedChart>
      </ChartContainer>
      <AiInsightPanel insight={insight} />
    </Card>
  )
}
