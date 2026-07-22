"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import type { PointEvolutionMarge } from "@/modules/rentabilite/services/margins.service"

const config = {
  chiffreAffaires: { label: "CA", color: "var(--chart-1)" },
  margeNette: { label: "Marge nette réelle", color: "var(--chart-2)" },
} satisfies ChartConfig

export function MarginEvolutionChart({ donnees }: { donnees: PointEvolutionMarge[] }) {
  return (
    <Card className="p-4">
      <div className="px-2">
        <p className="text-sm font-medium">Évolution de la marge nette</p>
        <p className="text-xs text-muted-foreground">6 derniers mois — CA vs marge réelle après charges</p>
      </div>
      <ChartContainer config={config} className="mt-4 aspect-auto h-64 w-full">
        <AreaChart data={donnees} margin={{ left: 0, right: 8 }}>
          <defs>
            <linearGradient id="fillMarge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-margeNette)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-margeNette)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeOpacity={0.15} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
            }
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={56} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
                }
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="chiffreAffaires"
            type="monotone"
            fill="none"
            stroke="var(--color-chiffreAffaires)"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <Area
            dataKey="margeNette"
            type="monotone"
            fill="url(#fillMarge)"
            stroke="var(--color-margeNette)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}
