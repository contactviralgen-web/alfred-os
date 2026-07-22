"use client"

import { useEffect, useState } from "react"
import { animate, motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

function useCompteur(valeurCible: number, duree = 0.8) {
  const [valeur, setValeur] = useState(0)

  useEffect(() => {
    const controls = animate(0, valeurCible, {
      duration: duree,
      ease: "easeOut",
      onUpdate: (v) => setValeur(v),
    })
    return () => controls.stop()
  }, [valeurCible, duree])

  return valeur
}

export const COULEURS_KPI = {
  bleu: {
    icone: "bg-blue-500/15 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400",
    glow: "hover:shadow-blue-500/10",
  },
  emeraude: {
    icone: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
    glow: "hover:shadow-emerald-500/10",
  },
  violet: {
    icone: "bg-violet-500/15 text-violet-600 dark:bg-violet-400/15 dark:text-violet-400",
    glow: "hover:shadow-violet-500/10",
  },
  ambre: {
    icone: "bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
    glow: "hover:shadow-amber-500/10",
  },
  rose: {
    icone: "bg-rose-500/15 text-rose-600 dark:bg-rose-400/15 dark:text-rose-400",
    glow: "hover:shadow-rose-500/10",
  },
} as const

export type CouleurKpi = keyof typeof COULEURS_KPI

export function KpiCard({
  titre,
  valeur,
  formatValeur = (v) => Math.round(v).toLocaleString("fr-FR"),
  suffixe,
  variationPct,
  badge,
  icone: Icone,
  couleur = "bleu",
}: {
  titre: string
  valeur: number
  formatValeur?: (v: number) => string
  suffixe?: string
  variationPct?: number
  badge?: React.ReactNode
  icone?: LucideIcon
  couleur?: CouleurKpi
}) {
  const valeurAnimee = useCompteur(valeur)
  const positif = (variationPct ?? 0) >= 0
  const palette = COULEURS_KPI[couleur]

  return (
    <Card
      className={cn(
        "gap-2 border border-border/60 p-4 shadow-none ring-0 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg",
        palette.glow
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{titre}</p>
        {Icone ? (
          <span className={cn("flex size-8 items-center justify-center rounded-full", palette.icone)}>
            <Icone className="size-4" strokeWidth={2.25} />
          </span>
        ) : null}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight tabular-nums">
          {formatValeur(valeurAnimee)}
        </span>
        {suffixe ? <span className="text-sm text-muted-foreground">{suffixe}</span> : null}
      </div>
      <div className="mt-0.5 flex items-center gap-1.5">
        {variationPct !== undefined ? (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold",
              positif
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {positif ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(variationPct).toFixed(1)}%
          </span>
        ) : null}
        {badge}
      </div>
    </Card>
  )
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}
