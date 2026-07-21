import { PackageX } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"

export type AlerteStockLigne = {
  id: string
  type: string
  products: { nom: string; categorie: string | null } | null
}

export function StockAlertsList({ alertes }: { alertes: AlerteStockLigne[] }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium">Alertes de stock</p>
      <p className="text-xs text-muted-foreground">{alertes.length} alerte(s) active(s)</p>
      <div className="mt-4 space-y-1">
        {alertes.length === 0 ? (
          <EmptyState icone={PackageX} titre="Aucune alerte" description="Tout le stock est sain." />
        ) : (
          alertes.map((alerte) => (
            <div
              key={alerte.id}
              className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-accent/40"
            >
              <div className="flex flex-col">
                <span>{alerte.products?.nom}</span>
                <span className="text-xs text-muted-foreground">{alerte.products?.categorie}</span>
              </div>
              <Badge variant={alerte.type === "rupture" ? "destructive" : "outline"}>
                {alerte.type === "rupture" ? "Rupture" : "Stock bas"}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
