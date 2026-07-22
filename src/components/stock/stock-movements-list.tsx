import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react"

import { Card } from "@/components/ui/card"

const ICONE_TYPE = { entree: ArrowDownLeft, sortie: ArrowUpRight, ajustement: RefreshCw }
const LABEL_TYPE = { entree: "Entrée", sortie: "Sortie", ajustement: "Ajustement" }

export type MouvementStockLigne = {
  id: string
  type: "entree" | "sortie" | "ajustement"
  quantite: number
  motif: string | null
  cree_le: string
  products: { nom: string } | { nom: string }[] | null
}

export function StockMovementsList({ mouvements }: { mouvements: MouvementStockLigne[] }) {
  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-medium">Derniers mouvements</p>
      {mouvements.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun mouvement enregistré.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {mouvements.map((m) => {
            const Icone = ICONE_TYPE[m.type]
            const produit = Array.isArray(m.products) ? m.products[0] : m.products
            return (
              <div key={m.id} className="flex items-center gap-3 py-2.5 text-sm">
                <Icone className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <p>
                    <span className="font-medium">{LABEL_TYPE[m.type]}</span> — {produit?.nom ?? "Produit"}
                    {m.motif ? ` (${m.motif})` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.cree_le).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="font-medium">
                  {m.type === "sortie" ? "-" : "+"}
                  {m.quantite}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
