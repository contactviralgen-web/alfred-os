"use client"

import { KpiCard, KpiGrid } from "@/components/dashboard/kpi-card"

const formatEur = (v: number) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function AmazonKpis({
  ca,
  benefice,
  commandes,
  scoreSante,
}: {
  ca: number
  benefice: number
  commandes: number
  scoreSante: number
}) {
  return (
    <KpiGrid>
      <KpiCard titre="CA Amazon (30j)" valeur={ca} formatValeur={formatEur} />
      <KpiCard titre="Bénéfice net réel (30j)" valeur={benefice} formatValeur={formatEur} />
      <KpiCard titre="Commandes Amazon (30j)" valeur={commandes} />
      <KpiCard
        titre="Account Health"
        valeur={scoreSante}
        suffixe="/100"
        badge={
          scoreSante >= 80 ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400">Bon état</span>
          ) : (
            <span className="text-xs text-amber-600 dark:text-amber-400">À surveiller</span>
          )
        }
      />
    </KpiGrid>
  )
}
