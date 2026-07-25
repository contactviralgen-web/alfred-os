import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RevenueTrendChart } from "@/components/dashboard/revenue-trend-chart"
import type { Kpi, TrendPoint } from "@/lib/demo/dashboard-data"

export function HeroMetric({ kpi, tendance }: { kpi: Kpi; tendance: TrendPoint[] }) {
  const isGood = kpi.trend === "up" ? kpi.positiveIsUp : !kpi.positiveIsUp
  const Icon = kpi.trend === "up" ? ArrowUpRight : ArrowDownRight

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="lg:w-64 lg:shrink-0">
          <p className="text-sm text-muted-foreground">{kpi.label}</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums text-primary">
            {kpi.value}
          </p>
          <p
            className={cn(
              "mt-3 flex items-center gap-1 text-sm tabular-nums",
              isGood ? "text-positive" : "text-negative"
            )}
          >
            <Icon className="size-4" />
            {kpi.trendLabel}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <RevenueTrendChart data={tendance} />
        </div>
      </CardContent>
    </Card>
  )
}
