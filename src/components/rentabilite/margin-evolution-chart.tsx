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
  chiffreAffaires: { label: "CA", color: "var(--chart-1)" },
  margeNette: { label: "Marge nette réelle", color: "var(--chart-2)" },
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
    <Card className="p-4">
      <div className="px-2">
        <p className="text-sm font-medium">Évolution de la marge nette</p>
        <p className="text-xs text-muted-foreground">6 derniers mois — CA (ligne de référence) vs marge réelle après charges (barres)</p>
      </div>
      {/* Marge nette en barres sur l'axe principal (visible, échelle adaptée
          à ses propres valeurs) : c'est la métrique à lire précisément mois
          par mois, y compris négative (barre sous zéro). CA en ligne de
          contexte sur un axe secondaire masqué — sans lui, son échelle bien
          plus grande écraserait visuellement les barres de marge. */}
      <ChartContainer config={config} className="mt-4 aspect-auto h-64 w-full">
        <ComposedChart data={donnees} margin={{ left: 0, right: 8 }}>
          <CartesianGrid vertical={false} strokeOpacity={0.3} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
            }
          />
          <YAxis
            yAxisId="marge"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={56}
            tickFormatter={(value: number) => formateurCompact.format(value)}
          />
          <YAxis yAxisId="ca" hide domain={["auto", "auto"]} />
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
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
          />
          <Bar
            yAxisId="marge"
            dataKey="margeNette"
            fill="var(--color-margeNette)"
            radius={[3, 3, 0, 0]}
            maxBarSize={36}
          />
        </ComposedChart>
      </ChartContainer>
      <AiInsightPanel insight={insight} />
    </Card>
  )
}
