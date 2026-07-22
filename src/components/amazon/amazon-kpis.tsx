"use client"

import { Activity, ShoppingBag, ShoppingCart, Wallet } from "lucide-react"

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
      <KpiCard titre="CA Amazon (30j)" valeur={ca} formatValeur={formatEur} icone={ShoppingCart} />
      <KpiCard titre="Bénéfice net réel (30j)" valeur={benefice} formatValeur={formatEur} icone={Wallet} />
      <KpiCard titre="Commandes Amazon (30j)" valeur={commandes} icone={ShoppingBag} />
      <KpiCard
        titre="Account Health"
        valeur={scoreSante}
        suffixe="/100"
        icone={Activity}
        badge={
          <span className="text-xs font-semibold text-muted-foreground">
            {scoreSante >= 80 ? "Bon état" : "À surveiller"}
          </span>
        }
      />
    </KpiGrid>
  )
}
