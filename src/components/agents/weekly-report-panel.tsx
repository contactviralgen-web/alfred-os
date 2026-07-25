"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Activity, AlertTriangle, CircleCheck, FileText, ListChecks, RefreshCw } from "lucide-react"

import { genererRapportAction } from "@/lib/actions/directeur.actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DecisionColumn } from "@/components/dashboard/decision-center"
import { cn } from "@/lib/utils"
import type { RapportHebdomadaire, SanteBusiness } from "@/modules/agents/services/weekly-report.service"

const LABEL_SANTE: Record<SanteBusiness, string> = {
  bonne: "Bonne santé",
  a_surveiller: "À surveiller",
  critique: "Critique",
}

const VARIANT_SANTE: Record<SanteBusiness, "secondary" | "outline" | "destructive"> = {
  bonne: "secondary",
  a_surveiller: "outline",
  critique: "destructive",
}

const TEINTE_SANTE: Record<SanteBusiness, string> = {
  bonne: "bg-primary/10 text-primary",
  a_surveiller: "bg-muted text-muted-foreground",
  critique: "bg-destructive/10 text-destructive",
}

export function WeeklyReportPanel({
  rapport,
  orgSlug,
  workspaceSlug,
}: {
  rapport: RapportHebdomadaire | null
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function generer() {
    startTransition(async () => {
      const resultat = await genererRapportAction(orgSlug, workspaceSlug)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="m-4 mb-0"
    >
      <Card className="gap-3 border border-border/60 p-4 shadow-none ring-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full",
                rapport ? TEINTE_SANTE[rapport.santeBusiness] : "bg-muted text-muted-foreground"
              )}
            >
              <Activity className="size-4" strokeWidth={2.25} />
            </span>
            <div>
              <p className="text-sm font-bold tracking-tight">Rapport hebdomadaire</p>
              {rapport ? (
                <Badge variant={VARIANT_SANTE[rapport.santeBusiness]} className="mt-0.5">
                  {LABEL_SANTE[rapport.santeBusiness]}
                </Badge>
              ) : null}
            </div>
          </div>
          <Button size="sm" variant="outline" disabled={isPending} onClick={generer}>
            <RefreshCw className={cn("size-4", isPending && "animate-spin")} />
            {isPending ? "Génération..." : "Générer maintenant"}
          </Button>
        </div>

        {rapport ? (
          <div className="grid grid-cols-1 gap-5 pt-1 md:grid-cols-3">
            <DecisionColumn
              titre="Problèmes"
              icone={AlertTriangle}
              elements={rapport.topProblemes}
              messageVide="Aucun problème détecté cette semaine."
            />
            <DecisionColumn
              titre="Opportunités"
              icone={CircleCheck}
              elements={rapport.topOpportunites}
              messageVide="Aucune opportunité identifiée cette semaine."
            />
            <DecisionColumn
              titre="Actions recommandées"
              icone={ListChecks}
              elements={rapport.actionsRecommandees}
              messageVide="Rien de prioritaire cette semaine."
            />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
            <FileText className="size-4 shrink-0" />
            Aucun rapport généré pour l&apos;instant — cliquez sur « Générer maintenant ».
          </div>
        )}
      </Card>
    </motion.div>
  )
}
