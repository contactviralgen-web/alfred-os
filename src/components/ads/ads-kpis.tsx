"use client"

import { Wallet, TrendingUp, Percent, Target } from "lucide-react"

import { KpiCard, KpiGrid } from "@/components/dashboard/kpi-card"

const formatEur = (v: number) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function AdsKpis({
  depenseTotale,
  caGenere,
  roasGlobal,
  tacosPct,
}: {
  depenseTotale: number
  caGenere: number
  roasGlobal: number
  tacosPct: number
}) {
  return (
    <KpiGrid>
      <KpiCard titre="Dépense pub (30j)" valeur={depenseTotale} formatValeur={formatEur} icone={Wallet} />
      <KpiCard titre="CA généré (30j)" valeur={caGenere} formatValeur={formatEur} icone={TrendingUp} />
      <KpiCard titre="ROAS global" valeur={roasGlobal} suffixe="x" icone={Target} />
      <KpiCard titre="TACOS" valeur={tacosPct} suffixe="%" icone={Percent} />
    </KpiGrid>
  )
}
