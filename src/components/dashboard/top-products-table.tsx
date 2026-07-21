import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { TrendingUp } from "lucide-react"

export type TopProduitLigne = {
  product_id: string | null
  nom: string | null
  categorie: string | null
  quantite_vendue: number | null
  chiffre_affaires: number | null
  marge_totale: number | null
}

export function TopProductsTable({ produits }: { produits: TopProduitLigne[] }) {
  const maxMarge = Math.max(...produits.map((p) => p.marge_totale ?? 0), 1)

  return (
    <Card className="p-4">
      <p className="text-sm font-medium">Produits les plus rentables</p>
      <p className="text-xs text-muted-foreground">Marge cumulée, 90 derniers jours</p>
      <div className="mt-4 space-y-3">
        {produits.length === 0 ? (
          <EmptyState icone={TrendingUp} titre="Pas encore de données" />
        ) : (
          produits.map((produit) => (
            <div key={produit.product_id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="font-medium">{produit.nom}</span>
                  <span className="text-xs text-muted-foreground">
                    {produit.categorie} · {produit.quantite_vendue} vendus
                  </span>
                </div>
                <span className="font-medium text-emerald-400">
                  +{(produit.marge_totale ?? 0).toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${((produit.marge_totale ?? 0) / maxMarge) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
