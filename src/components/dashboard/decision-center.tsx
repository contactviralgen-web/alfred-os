import { AlertTriangle, CircleCheck, ListChecks } from "lucide-react"

export function DecisionColumn({
  titre,
  icone: Icone,
  elements,
  messageVide,
}: {
  titre: string
  icone: typeof AlertTriangle
  elements: string[]
  messageVide: string
}) {
  return (
    <div className="space-y-2.5 border-l border-border pl-3">
      <p className="flex items-center gap-1.5 text-sm font-bold tracking-tight">
        <Icone className="size-3.5 text-primary" strokeWidth={2.25} />
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
    <div className="border-t border-border/70 pt-6">
      <p className="mb-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Centre de décisions
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <DecisionColumn
          titre="Problèmes"
          icone={AlertTriangle}
          elements={problemes}
          messageVide="Aucun problème détecté actuellement."
        />
        <DecisionColumn
          titre="Opportunités"
          icone={CircleCheck}
          elements={opportunites}
          messageVide="Pas encore assez de données pour une recommandation."
        />
        <DecisionColumn
          titre="Actions du jour"
          icone={ListChecks}
          elements={actions}
          messageVide="Rien de prioritaire aujourd'hui."
        />
      </div>
    </div>
  )
}
