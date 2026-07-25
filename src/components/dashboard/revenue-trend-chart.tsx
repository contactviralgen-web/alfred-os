"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

export type ChartPoint = {
  label: string
  value: number
}

function TrendTooltip({
  active,
  payload,
  label,
  format,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
  format: (value: number) => string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="text-foreground tabular-nums">{format(payload[0].value)}</p>
    </div>
  )
}

export function RevenueTrendChart({
  data,
  format,
}: {
  data: ChartPoint[]
  format: (value: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9f0a" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#ff9f0a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#30363d" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8b949e", fontSize: 12 }}
        />
        <Tooltip content={<TrendTooltip format={format} />} cursor={{ stroke: "#30363d" }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#ff9f0a"
          strokeWidth={2}
          fill="url(#metricFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
