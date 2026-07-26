"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"

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
    <div className="rounded-lg border border-white/10 bg-popover px-3 py-2 text-sm shadow-lg backdrop-blur-xl">
      <p className="font-medium">{label}</p>
      <p className="text-primary tabular-nums">{format(payload[0].value)}</p>
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
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap="28%">
        <defs>
          <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9f0a" stopOpacity={1} />
            <stop offset="100%" stopColor="#ff9f0a" stopOpacity={0.45} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9aa1ab", fontSize: 12 }}
        />
        <Tooltip
          content={<TrendTooltip format={format} />}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="value" fill="url(#metricFill)" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  )
}
