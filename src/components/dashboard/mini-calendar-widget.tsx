import { CalendarClock } from "lucide-react"

import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"

export type EvenementLigne = {
  id: string
  titre: string
  type: string
  debut_le: string
}

const LIBELLES_TYPE: Record<string, string> = {
  reunion: "Réunion",
  echeance: "Échéance",
  rappel: "Rappel",
}

export function MiniCalendarWidget({ evenements }: { evenements: EvenementLigne[] }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium">Prochains événements</p>
      <p className="text-xs text-muted-foreground">Calendrier de l&apos;équipe</p>
      <div className="mt-4 space-y-1">
        {evenements.length === 0 ? (
          <EmptyState icone={CalendarClock} titre="Aucun événement à venir" />
        ) : (
          evenements.map((evenement) => {
            const date = new Date(evenement.debut_le)
            return (
              <div
                key={evenement.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent/40"
              >
                <div className="flex w-11 shrink-0 flex-col items-center rounded-md border border-border/60 py-1">
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {date.toLocaleDateString("fr-FR", { month: "short" })}
                  </span>
                  <span className="text-sm font-semibold">{date.getDate()}</span>
                </div>
                <div className="flex flex-col">
                  <span>{evenement.titre}</span>
                  <span className="text-xs text-muted-foreground">
                    {LIBELLES_TYPE[evenement.type] ?? evenement.type}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
