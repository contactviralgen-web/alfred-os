"use client"

import { KpiCard, KpiGrid } from "@/components/dashboard/kpi-card"

const formatEur = (v: number) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function DashboardKpis({
  ca30j,
  benefice30j,
  margePct,
  commandes30j,
  croissancePct,
}: {
  ca30j: number
  benefice30j: number
  margePct: number
  commandes30j: number
  croissancePct?: number
}) {
  return (
    <KpiGrid>
      <KpiCard
        titre="Chiffre d'affaires (30j)"
        valeur={ca30j}
        formatValeur={formatEur}
        variationPct={croissancePct}
      />
      <KpiCard titre="Bénéfice (30j)" valeur={benefice30j} formatValeur={formatEur} />
      <KpiCard
        titre="Marge"
        valeur={margePct}
        formatValeur={(v) => `${v.toFixed(1)}`}
        suffixe="%"
      />
      <KpiCard titre="Commandes (30j)" valeur={commandes30j} />
    </KpiGrid>
  )
}
