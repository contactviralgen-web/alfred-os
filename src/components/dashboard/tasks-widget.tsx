"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { ListChecks } from "lucide-react"

import { basculerStatutTacheAction } from "@/lib/actions/task.actions"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/shared/empty-state"

export type TacheLigne = {
  id: string
  titre: string
  statut: string
  priorite: string
  echeance_le: string | null
}

const COULEUR_PRIORITE: Record<string, "destructive" | "outline" | "secondary"> = {
  haute: "destructive",
  normale: "outline",
  basse: "secondary",
}

export function TasksWidget({
  taches,
  orgSlug,
  workspaceSlug,
}: {
  taches: TacheLigne[]
  orgSlug: string
  workspaceSlug: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Card className="p-4">
      <p className="text-sm font-medium">Mes tâches</p>
      <p className="text-xs text-muted-foreground">{taches.length} en cours</p>
      <div className="mt-4 space-y-1">
        {taches.length === 0 ? (
          <EmptyState icone={ListChecks} titre="Aucune tâche en attente" />
        ) : (
          taches.map((tache) => (
            <label
              key={tache.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent/40"
            >
              <Checkbox
                disabled={isPending}
                onCheckedChange={(coche) =>
                  startTransition(async () => {
                    const resultat = await basculerStatutTacheAction(
                      tache.id,
                      coche ? "terminee" : "a_faire",
                      orgSlug,
                      workspaceSlug
                    )
                    if (!resultat.succes) toast.error(resultat.message)
                  })
                }
              />
              <span className="flex-1">{tache.titre}</span>
              <Badge variant={COULEUR_PRIORITE[tache.priorite] ?? "outline"}>
                {tache.priorite}
              </Badge>
            </label>
          ))
        )}
      </div>
    </Card>
  )
}
