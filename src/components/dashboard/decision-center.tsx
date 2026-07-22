import { AlertTriangle, CircleCheck, ListChecks } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function Colonne({
  titre,
  icone: Icone,
  accent,
  elements,
  messageVide,
}: {
  titre: string
  icone: typeof AlertTriangle
  accent: "rose" | "emeraude" | "bleu"
  elements: string[]
  messageVide: string
}) {
  const styles = {
    rose: {
      bord: "border-l-rose-500",
      icone: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    },
    emeraude: {
      bord: "border-l-emerald-500",
      icone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    bleu: {
      bord: "border-l-primary",
      icone: "bg-primary/15 text-primary",
    },
  }[accent]

  return (
    <div className={cn("space-y-2.5 border-l-2 pl-3", styles.bord)}>
      <p className="flex items-center gap-1.5 text-sm font-bold tracking-tight">
        <span className={cn("flex size-5 items-center justify-center rounded-full", styles.icone)}>
          <Icone className="size-3" strokeWidth={2.5} />
        </span>
        {titre}
      </p>
      {elements.length === 0 ? (
        <p className="text-sm text-muted-foreground">{messageVide}</p>
      ) : (
        <ul className="space-y-1.5">
          {elements.map((texte, i) => (
            <li key={i} className="text-sm leading-snug">
              {texte}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function DecisionCenter({
  problemes,
  opportunites,
  actions,
}: {
  problemes: string[]
  opportunites: string[]
  actions: string[]
}) {
  return (
    <Card className="border border-border/60 p-4 shadow-none ring-0">
      <p className="mb-3 text-base font-bold tracking-tight">Centre de décisions</p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Colonne
          titre="Problèmes"
          icone={AlertTriangle}
          accent="rose"
          elements={problemes}
          messageVide="Aucun problème détecté actuellement."
        />
        <Colonne
          titre="Opportunités"
          icone={CircleCheck}
          accent="emeraude"
          elements={opportunites}
          messageVide="Pas encore assez de données pour une recommandation."
        />
        <Colonne
          titre="Actions du jour"
          icone={ListChecks}
          accent="bleu"
          elements={actions}
          messageVide="Rien de prioritaire aujourd'hui."
        />
      </div>
    </Card>
  )
}
