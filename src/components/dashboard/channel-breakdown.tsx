import { Card } from "@/components/ui/card"

const LIBELLES: Record<string, string> = {
  site_web: "Site web",
  amazon: "Amazon",
  manuel: "Manuel",
}

const COULEURS: Record<string, string> = {
  site_web: "bg-indigo-500",
  amazon: "bg-amber-500",
  manuel: "bg-zinc-500",
}

export function ChannelBreakdown({
  donnees,
}: {
  donnees: { canal: string; montant: number }[]
}) {
  const total = donnees.reduce((s, d) => s + d.montant, 0)
  const trie = [...donnees].sort((a, b) => b.montant - a.montant)

  return (
    <Card className="p-4">
      <p className="text-sm font-medium">Ventes par canal</p>
      <p className="text-xs text-muted-foreground">30 derniers jours</p>
      <div className="mt-4 space-y-3">
        {trie.map((ligne) => {
          const pct = total > 0 ? (ligne.montant / total) * 100 : 0
          return (
            <div key={ligne.canal}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{LIBELLES[ligne.canal] ?? ligne.canal}</span>
                <span className="text-muted-foreground">
                  {ligne.montant.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${COULEURS[ligne.canal] ?? "bg-zinc-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
        {donnees.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune donnée pour le moment.</p>
        ) : null}
      </div>
    </Card>
  )
}
