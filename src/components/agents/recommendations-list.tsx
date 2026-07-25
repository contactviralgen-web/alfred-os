"use client"

import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Bot, Boxes, Megaphone, Sparkles, TrendingUp, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Recommandation, TypeAgentIA } from "@/modules/agents/services/recommendations.service"

const LABEL_AGENT: Record<TypeAgentIA, string> = {
  rentabilite: "Rentabilité",
  publicite: "Publicité",
  stock: "Stock",
  directeur: "Directeur",
}

const ICONE_AGENT: Record<TypeAgentIA, LucideIcon> = {
  rentabilite: TrendingUp,
  publicite: Megaphone,
  stock: Boxes,
  directeur: Bot,
}

const formatEur = (v: number) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function RecommendationsList({ recommandations }: { recommandations: Recommandation[] }) {
  if (recommandations.length === 0) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        <Sparkles className="size-4 shrink-0" />
        Aucune recommandation active pour l&apos;instant.
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-2.5"
    >
      {recommandations.map((r) => {
        const Icone = ICONE_AGENT[r.agent]
        const negatif = r.impactEstimeEur !== null && r.impactEstimeEur < 0

        return (
          <motion.div
            key={r.id}
            variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          >
            <Card className="flex-row items-start gap-3 border border-border/60 p-4 shadow-none ring-0 transition-colors duration-200 hover:border-primary/30">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  negatif ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                )}
              >
                <Icone className="size-4" strokeWidth={2.25} />
              </span>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{LABEL_AGENT[r.agent]}</Badge>
                  <p className="text-sm font-medium">{r.problemeDetecte}</p>
                </div>
                <p className="text-xs text-muted-foreground">{r.analyseIa}</p>
                <p className="text-sm">{r.recommandation}</p>
              </div>

              {r.impactEstimeEur !== null ? (
                <span
                  className={cn(
                    "flex shrink-0 items-center gap-0.5 text-sm font-semibold tabular-nums",
                    negatif ? "text-destructive" : "text-foreground"
                  )}
                >
                  {negatif ? <ArrowDownRight className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                  {formatEur(Math.abs(r.impactEstimeEur))}
                </span>
              ) : null}
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
