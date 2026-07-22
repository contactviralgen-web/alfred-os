"use client"

import { useEffect, useState } from "react"
import { animate } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Percent, ShoppingBag, Wallet } from "lucide-react"

import { Card } from "@/components/ui/card"
import { LIBELLE_PERIODE, type PeriodeGraphique } from "@/modules/dashboard/services/revenue-chart.types"

const formatEur = (v: number) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

function useCompteur(valeurCible: number) {
  const [valeur, setValeur] = useState(0)
  useEffect(() => {
    const controls = animate(0, valeurCible, { duration: 0.8, ease: "easeOut", onUpdate: setValeur })
    return () => controls.stop()
  }, [valeurCible])
  return valeur
}

function MiniStat({
  titre,
  valeur,
  icone: Icone,
}: {
  titre: string
  valeur: string
  icone: typeof Percent
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icone className="size-4.5" strokeWidth={2} />
      </span>
      <div>
        <p className="text-lg font-bold tracking-tight tabular-nums">{valeur}</p>
        <p className="text-xs text-muted-foreground">{titre}</p>
      </div>
    </div>
  )
}

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
  const caAnime = useCompteur(ca)
  const positif = (croissancePct ?? 0) >= 0

  return (
    <Card className="border border-border/60 p-5 shadow-none ring-0">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">
        Résumé — {suffixePeriode}
      </p>
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3 md:border-r md:border-border md:pr-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
            <Wallet className="size-5" strokeWidth={2} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Chiffre d&apos;affaires</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight tabular-nums whitespace-nowrap">
                {formatEur(caAnime)}
              </p>
              {croissancePct !== undefined ? (
                <span
                  className={
                    "flex items-center gap-0.5 text-xs font-semibold " +
                    (positif ? "text-foreground" : "text-muted-foreground")
                  }
                >
                  {positif ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {Math.abs(croissancePct).toFixed(1)}%
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-6">
          <MiniStat titre="Bénéfice" valeur={formatEur(benefice)} icone={Wallet} />
          <MiniStat titre="Marge" valeur={`${margePct.toFixed(1)}%`} icone={Percent} />
          <MiniStat titre="Commandes" valeur={String(commandes)} icone={ShoppingBag} />
        </div>
      </div>
    </Card>
  )
}
