import { CircleAlert } from "lucide-react"

import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"

export type CommandeBloqueeLigne = {
  id: string
  numero_commande: string
  client_nom: string | null
  montant_total: number
  canal: string
  cree_le: string
}

export function BlockedOrdersList({ commandes }: { commandes: CommandeBloqueeLigne[] }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium">Commandes bloquées</p>
      <p className="text-xs text-muted-foreground">Nécessitent une action</p>
      <div className="mt-4 space-y-1">
        {commandes.length === 0 ? (
          <EmptyState icone={CircleAlert} titre="Aucune commande bloquée" />
        ) : (
          commandes.map((commande) => (
            <div
              key={commande.id}
              className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-accent/40"
            >
              <div className="flex flex-col">
                <span className="font-medium">{commande.numero_commande}</span>
                <span className="text-xs text-muted-foreground">{commande.client_nom}</span>
              </div>
              <span className="text-sm">
                {commande.montant_total.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
