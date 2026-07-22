import { Card } from "@/components/ui/card"

const LIBELLES: Record<string, string> = {
  site_web: "Site web",
  amazon: "Amazon",
  manuel: "Manuel",
}

// Un point bleu (marque) pour le canal dominant, gris neutre pour les
// autres — distinction nécessaire entre canaux réels sans multiplier les
// teintes de décoration.
const POINT: Record<number, string> = {
  0: "bg-primary",
  1: "bg-zinc-400",
  2: "bg-zinc-300",
}

export function ChannelBreakdown({
  donnees,
}: {
  donnees: { canal: string; montant: number }[]
}) {
  const total = donnees.reduce((s, d) => s + d.montant, 0)
  const trie = [...donnees].sort((a, b) => b.montant - a.montant)

  return (
    <Card className="border border-border/60 p-4 shadow-none ring-0">
      <p className="text-sm font-bold tracking-tight">Ventes par canal</p>
      <p className="text-xs text-muted-foreground">30 derniers jours</p>
      <div className="mt-5 space-y-4">
        {trie.map((ligne, i) => {
          const pct = total > 0 ? (ligne.montant / total) * 100 : 0
          return (
            <div key={ligne.canal} className="flex items-center gap-2.5">
              <span className={`size-2.5 shrink-0 rounded-full ${POINT[i] ?? "bg-zinc-300"}`} />
              <span className="flex-1 text-sm">{LIBELLES[ligne.canal] ?? ligne.canal}</span>
              <span className="text-xs font-medium text-muted-foreground">{pct.toFixed(1)}%</span>
              <span className="w-20 text-right text-sm font-bold tabular-nums">
                {ligne.montant.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                })}
              </span>
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
