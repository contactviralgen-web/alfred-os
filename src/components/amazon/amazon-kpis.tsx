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
      <KpiCard titre="CA Amazon (30j)" valeur={ca} formatValeur={formatEur} icone={ShoppingCart} couleur="bleu" />
      <KpiCard
        titre="Bénéfice net réel (30j)"
        valeur={benefice}
        formatValeur={formatEur}
        icone={Wallet}
        couleur="emeraude"
      />
      <KpiCard titre="Commandes Amazon (30j)" valeur={commandes} icone={ShoppingBag} couleur="ambre" />
      <KpiCard
        titre="Account Health"
        valeur={scoreSante}
        suffixe="/100"
        icone={Activity}
        couleur={scoreSante >= 80 ? "emeraude" : "rose"}
        badge={
          scoreSante >= 80 ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Bon état</span>
          ) : (
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">À surveiller</span>
          )
        }
      />
    </KpiGrid>
  )
}
