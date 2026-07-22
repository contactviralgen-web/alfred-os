"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { mettreAJourSeuilAlerteAction } from "@/lib/actions/stock.actions"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdjustStockDialog } from "@/components/stock/adjust-stock-dialog"
import type { LigneStock } from "@/modules/stock/services/stock.service"

const VARIANT_STATUT = {
  rupture: "destructive",
  stock_bas: "secondary",
  sain: "outline",
} as const

const LABEL_STATUT = { rupture: "Rupture", stock_bas: "Stock bas", sain: "Sain" }

function SeuilInput({
  productId,
  seuilInitial,
  orgSlug,
  workspaceSlug,
}: {
  productId: string
  seuilInitial: number
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [seuil, setSeuil] = useState(String(seuilInitial))
  const [isPending, startTransition] = useTransition()

  function enregistrer() {
    if (Number(seuil) === seuilInitial) return
    startTransition(async () => {
      const resultat = await mettreAJourSeuilAlerteAction(orgSlug, workspaceSlug, productId, {
        seuil: Number(seuil),
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      router.refresh()
    })
  }

  return (
    <Input
      type="number"
      min={0}
      className="h-8 w-20"
      value={seuil}
      disabled={isPending}
      onChange={(e) => setSeuil(e.target.value)}
      onBlur={enregistrer}
    />
  )
}

export function StockTable({
  produits,
  orgSlug,
  workspaceSlug,
}: {
  produits: LigneStock[]
  orgSlug: string
  workspaceSlug: string
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produit</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Disponible</TableHead>
          <TableHead>Réservé</TableHead>
          <TableHead>Seuil d&apos;alerte</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {produits.map((produit) => (
          <TableRow key={produit.productId}>
            <TableCell>
              <p className="text-sm font-medium">{produit.nom}</p>
              <p className="text-xs text-muted-foreground">{produit.sku}</p>
            </TableCell>
            <TableCell>
              <Badge variant={VARIANT_STATUT[produit.statut]}>{LABEL_STATUT[produit.statut]}</Badge>
            </TableCell>
            <TableCell className="text-sm font-medium">{produit.quantiteDisponible}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{produit.quantiteReservee}</TableCell>
            <TableCell>
              <SeuilInput
                productId={produit.productId}
                seuilInitial={produit.seuilAlerte}
                orgSlug={orgSlug}
                workspaceSlug={workspaceSlug}
              />
            </TableCell>
            <TableCell>
              <AdjustStockDialog
                productId={produit.productId}
                produitNom={produit.nom}
                orgSlug={orgSlug}
                workspaceSlug={workspaceSlug}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
