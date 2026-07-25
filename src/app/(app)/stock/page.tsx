import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/layout/page-header"
import { cn } from "@/lib/utils"
import { demoStockAvecCouverture, type StockProduit } from "@/lib/demo/stock-data"

const STATUT_LABEL: Record<StockProduit["statut"], string> = {
  ok: "OK",
  "a-commander": "À commander",
  "rupture-imminente": "Rupture imminente",
}

const STATUT_CLASS: Record<StockProduit["statut"], string> = {
  ok: "border-positive/40 text-positive bg-positive/10",
  "a-commander": "border-primary/40 text-primary bg-primary/10",
  "rupture-imminente": "border-negative/40 text-negative bg-negative/10",
}

export default function StockPage() {
  const aRisque = demoStockAvecCouverture.filter((p) => p.statut !== "ok").length

  return (
    <>
      <PageHeader
        title="Stock"
        description="Vélocité de vente et délais fournisseurs — Agent Stock. Quand commander pour éviter la rupture."
      />

      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            {aRisque} produit{aRisque > 1 ? "s" : ""} à surveiller sur {demoStockAvecCouverture.length}
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">Stock actuel</TableHead>
                <TableHead className="text-right">Ventes / jour</TableHead>
                <TableHead className="text-right">Jours de couverture</TableHead>
                <TableHead className="text-right">Délai fournisseur</TableHead>
                <TableHead className="text-right">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoStockAvecCouverture.map((p) => (
                <TableRow key={p.nom}>
                  <TableCell className="font-medium">{p.nom}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.stockActuel}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {p.ventesJour}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums font-medium",
                      p.joursDeCouverture <= p.delaiFournisseurJours
                        ? "text-negative"
                        : "text-foreground"
                    )}
                  >
                    {p.joursDeCouverture} j
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {p.delaiFournisseurJours} j
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={cn("font-normal", STATUT_CLASS[p.statut])}>
                      {STATUT_LABEL[p.statut]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
