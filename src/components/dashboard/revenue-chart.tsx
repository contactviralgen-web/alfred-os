"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
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
import type { PointCourbeCA } from "@/modules/dashboard/services/revenue-metrics.service"

const config = {
  chiffreAffaires: { label: "CA réel", color: "var(--chart-1)" },
  chiffreAffairesPrevu: { label: "Prévision", color: "var(--chart-2)" },
} satisfies ChartConfig

export function RevenueChart({ donnees }: { donnees: PointCourbeCA[] }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between px-2">
        <div>
          <p className="text-sm font-medium">Chiffre d&apos;affaires</p>
          <p className="text-xs text-muted-foreground">30 derniers jours + 14 jours de prévision</p>
        </div>
        <ForecastBadge />
      </div>
      <ChartContainer config={config} className="mt-4 aspect-auto h-72 w-full">
        <AreaChart data={donnees} margin={{ left: 0, right: 8 }}>
          <defs>
            <linearGradient id="fillCa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chiffreAffaires)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-chiffreAffaires)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeOpacity={0.15} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
            }
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                  })
                }
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="chiffreAffaires"
            type="monotone"
            fill="url(#fillCa)"
            stroke="var(--color-chiffreAffaires)"
            strokeWidth={2}
            connectNulls
          />
          <Area
            dataKey="chiffreAffairesPrevu"
            type="monotone"
            fill="none"
            stroke="var(--color-chiffreAffairesPrevu)"
            strokeWidth={2}
            strokeDasharray="4 4"
            connectNulls
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}
