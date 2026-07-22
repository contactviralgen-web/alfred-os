import { Card } from "@/components/ui/card"

type Execution = { id: string; resume: string; cree_le: string; automation_rules: { nom: string } | { nom: string }[] | null }

export function ExecutionsList({ executions }: { executions: Execution[] }) {
  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-medium">Historique d&apos;exécution</p>
      {executions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune exécution pour l&apos;instant.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {executions.map((e) => (
            <div key={e.id} className="py-2.5 text-sm">
              <p>{e.resume}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(e.cree_le).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
