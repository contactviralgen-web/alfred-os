"use client"

import { KpiCard, KpiGrid } from "@/components/dashboard/kpi-card"
import { LIBELLE_PERIODE, type PeriodeGraphique } from "@/modules/dashboard/services/revenue-chart.types"

const formatEur = (v: number) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function DashboardKpis({
  periode,
  ca,
  benefice,
  margePct,
  commandes,
  croissancePct,
}: {
  periode: PeriodeGraphique
  ca: number
  benefice: number
  margePct: number
  commandes: number
  croissancePct?: number
}) {
  const suffixePeriode = LIBELLE_PERIODE[periode]

  return (
    <KpiGrid>
      <KpiCard
        titre={`Chiffre d'affaires (${suffixePeriode})`}
        valeur={ca}
        formatValeur={formatEur}
        variationPct={croissancePct}
      />
      <KpiCard titre={`Bénéfice (${suffixePeriode})`} valeur={benefice} formatValeur={formatEur} />
      <KpiCard
        titre="Marge"
        valeur={margePct}
        formatValeur={(v) => `${v.toFixed(1)}`}
        suffixe="%"
      />
      <KpiCard titre={`Commandes (${suffixePeriode})`} valeur={commandes} />
    </KpiGrid>
  )
}
