"use client"

import { useState } from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { RevenueTrendChart } from "@/components/dashboard/revenue-trend-chart"
import { cn } from "@/lib/utils"
import {
  METRIC_LABELS,
  METRIC_ORDER,
  PERIOD_LABELS,
  PERIOD_ORDER,
  demoStatsByPeriod,
  demoTendanceByPeriod,
  formatMetricTrend,
  formatMetricValue,
  metricToKpi,
  type MetricKey,
  type Period,
} from "@/lib/demo/dashboard-data"

export function OverviewPanel() {
  const [period, setPeriod] = useState<Period>("mois")
  const [metric, setMetric] = useState<MetricKey>("ca")

  const stats = demoStatsByPeriod[period]
  const points = demoTendanceByPeriod[period]
  const focused = stats[metric]
  const isGood = focused.positiveIsUp ? focused.trend >= 0 : focused.trend <= 0
  const TrendIcon = focused.trend >= 0 ? ArrowUpRight : ArrowDownRight
  const secondaryMetrics = METRIC_ORDER.filter((m) => m !== metric)

  return (
    <div className="space-y-4">
      <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
        <TabsList>
          {PERIOD_ORDER.map((p) => (
            <TabsTrigger key={p} value={p}>
              {PERIOD_LABELS[p]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="space-y-4 lg:w-64 lg:shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {METRIC_ORDER.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetric(m)}
                  aria-pressed={m === metric}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    m === metric
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {METRIC_LABELS[m]}
                </button>
              ))}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{METRIC_LABELS[metric]}</p>
              <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums text-primary">
                {formatMetricValue(metric, focused.value)}
              </p>
              <p
                className={cn(
                  "mt-3 flex items-center gap-1 text-sm tabular-nums",
                  isGood ? "text-positive" : "text-negative"
                )}
              >
                <TrendIcon className="size-4" />
                {formatMetricTrend(metric, focused.trend)}
              </p>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <RevenueTrendChart
              data={points.map((p) => ({ label: p.label, value: p[metric] }))}
              format={(v) => formatMetricValue(metric, v)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {secondaryMetrics.map((m) => (
          <KpiCard key={m} {...metricToKpi(m, stats[m])} />
        ))}
      </div>
    </div>
  )
}
