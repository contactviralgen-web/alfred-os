"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"
import type { TrendPoint } from "@/lib/demo/dashboard-data"

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; dataKey: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  const ca = payload.find((p) => p.dataKey === "ca")?.value
  const profit = payload.find((p) => p.dataKey === "profit")?.value

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">{label}</p>
      {ca !== undefined && (
        <p className="text-muted-foreground">
          CA <span className="text-foreground tabular-nums">{ca.toLocaleString("fr-FR")} €</span>
        </p>
      )}
      {profit !== undefined && (
        <p className="text-muted-foreground">
          Profit <span className="text-primary tabular-nums">{profit.toLocaleString("fr-FR")} €</span>
        </p>
      )}
    </div>
  )
}

export function RevenueTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9f0a" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#ff9f0a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#30363d" strokeDasharray="3 3" />
        <XAxis
          dataKey="semaine"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8b949e", fontSize: 12 }}
        />
        <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#30363d" }} />
        <Area
          type="monotone"
          dataKey="ca"
          stroke="#30363d"
          strokeWidth={1.5}
          fill="none"
        />
        <Area
          type="monotone"
          dataKey="profit"
          stroke="#ff9f0a"
          strokeWidth={2}
          fill="url(#profitFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
