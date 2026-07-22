import { AlertTriangle, CircleCheck, ListChecks } from "lucide-react"

import { Card } from "@/components/ui/card"

export type ProblemeDecision = { texte: string }
export type OpportuniteDecision = { texte: string }
export type ActionDecision = { texte: string }

function Colonne({
  titre,
  icone: Icone,
  couleur,
  elements,
  messageVide,
}: {
  titre: string
  icone: typeof AlertTriangle
  couleur: string
  elements: string[]
  messageVide: string
}) {
  return (
    <div className="space-y-2">
      <p className={`flex items-center gap-1.5 text-xs font-medium ${couleur}`}>
        <Icone className="size-3.5" />
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
    <Card className="p-4">
      <p className="mb-3 text-sm font-medium">Centre de décisions</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Colonne
          titre="Problèmes"
          icone={AlertTriangle}
          couleur="text-red-600 dark:text-red-400"
          elements={problemes}
          messageVide="Aucun problème détecté actuellement."
        />
        <Colonne
          titre="Opportunités"
          icone={CircleCheck}
          couleur="text-emerald-600 dark:text-emerald-400"
          elements={opportunites}
          messageVide="Pas encore assez de données pour une recommandation."
        />
        <Colonne
          titre="Actions du jour"
          icone={ListChecks}
          couleur="text-indigo-600 dark:text-indigo-400"
          elements={actions}
          messageVide="Rien de prioritaire aujourd'hui."
        />
      </div>
    </Card>
  )
}
