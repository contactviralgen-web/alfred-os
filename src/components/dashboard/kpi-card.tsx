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

export function KpiCard({
  titre,
  valeur,
  formatValeur = (v) => Math.round(v).toLocaleString("fr-FR"),
  suffixe,
  variationPct,
  icone: Icone,
  badge,
}: {
  titre: string
  valeur: number
  formatValeur?: (v: number) => string
  suffixe?: string
  variationPct?: number
  icone: LucideIcon
  badge?: React.ReactNode
}) {
  const valeurAnimee = useCompteur(valeur)
  const positif = (variationPct ?? 0) >= 0

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{titre}</p>
        <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icone className="size-3.5" />
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight">
          {formatValeur(valeurAnimee)}
        </span>
        {suffixe ? <span className="text-sm text-muted-foreground">{suffixe}</span> : null}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        {variationPct !== undefined ? (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              positif ? "text-emerald-400" : "text-red-400"
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
