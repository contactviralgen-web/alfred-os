import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Kpi } from "@/lib/demo/dashboard-data"

export function KpiCard({ label, value, trend, trendLabel, positiveIsUp }: Kpi) {
  const isGood = trend === "up" ? positiveIsUp : !positiveIsUp
  const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight

  return (
    <Card>
      <CardHeader>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-sm tabular-nums",
            isGood ? "text-positive" : "text-negative"
          )}
        >
          <Icon className="size-3.5" />
          {trendLabel}
        </p>
      </CardContent>
    </Card>
  )
}
