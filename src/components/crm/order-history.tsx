import { Badge } from "@/components/ui/badge"

export type CommandeLigne = {
  id: string
  numero_commande: string
  canal: string
  statut: string
  montant_total: number
  cree_le: string
}

const LIBELLES_CANAL: Record<string, string> = {
  site_web: "Site web",
  amazon: "Amazon",
  manuel: "Manuel",
}

export function OrderHistory({ commandes }: { commandes: CommandeLigne[] }) {
  if (commandes.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune commande.</p>
  }

  return (
    <div className="divide-y divide-border/60">
      {commandes.map((commande) => (
        <div key={commande.id} className="flex items-center justify-between py-2.5 text-sm">
          <div>
            <p className="font-medium">{commande.numero_commande}</p>
            <p className="text-xs text-muted-foreground">
              {LIBELLES_CANAL[commande.canal] ?? commande.canal} ·{" "}
              {new Date(commande.cree_le).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{commande.statut}</Badge>
            <span className="font-medium">
              {commande.montant_total.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
