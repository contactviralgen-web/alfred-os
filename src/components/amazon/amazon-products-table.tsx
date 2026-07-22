import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LigneStock } from "@/modules/stock/services/stock.service"

const VARIANT_STATUT = { rupture: "destructive", stock_bas: "secondary", sain: "outline" } as const

export function AmazonProductsTable({ produits }: { produits: LigneStock[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock disponible</TableHead>
            <TableHead>Statut listing</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produits.map((p) => (
            <TableRow key={p.productId}>
              <TableCell className="text-sm font-medium">{p.nom}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.sku}</TableCell>
              <TableCell className="text-sm">{p.quantiteDisponible}</TableCell>
              <TableCell>
                <Badge variant={VARIANT_STATUT[p.statut]}>
                  {p.statut === "rupture" ? "En rupture" : "Synchronisé"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
