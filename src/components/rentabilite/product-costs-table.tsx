"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { mettreAJourCoutsProduitAction } from "@/lib/actions/rentabilite.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ReglagesCoutsProduit } from "@/modules/rentabilite/services/margins.service"

type Champ = Exclude<
  keyof ReglagesCoutsProduit,
  "productId" | "sku" | "nom" | "categorie" | "prixAchat" | "prixVente"
>

const COLONNES: { champ: Champ; label: string; suffixe: string }[] = [
  { champ: "coutTransportFlat", label: "Transport", suffixe: "€/unité" },
  { champ: "coutDouaneFlat", label: "Douane", suffixe: "€/unité" },
  { champ: "fraisAmazonPct", label: "Frais Amazon", suffixe: "%" },
  { champ: "fraisFbaFlat", label: "Frais FBA", suffixe: "€/unité" },
  { champ: "fraisStockageUnitaireFlat", label: "Stockage", suffixe: "€/unité" },
  { champ: "tauxRetourPct", label: "Taux retour", suffixe: "%" },
  { champ: "coutDiversFlat", label: "Coûts divers", suffixe: "€/unité" },
  { champ: "margePlancherPct", label: "Marge plancher", suffixe: "%" },
]

function LigneProduit({
  produit,
  orgSlug,
  workspaceSlug,
}: {
  produit: ReglagesCoutsProduit
  orgSlug: string
  workspaceSlug: string
}) {
  const [valeurs, setValeurs] = useState(produit)
  const [isPending, startTransition] = useTransition()

  function onSave() {
    startTransition(async () => {
      const resultat = await mettreAJourCoutsProduitAction(orgSlug, workspaceSlug, produit.productId, {
        cout_transport_flat: valeurs.coutTransportFlat,
        cout_douane_flat: valeurs.coutDouaneFlat,
        frais_amazon_pct: valeurs.fraisAmazonPct,
        frais_fba_flat: valeurs.fraisFbaFlat,
        frais_stockage_unitaire_flat: valeurs.fraisStockageUnitaireFlat,
        taux_retour_pct: valeurs.tauxRetourPct,
        cout_divers_flat: valeurs.coutDiversFlat,
        marge_plancher_pct: valeurs.margePlancherPct,
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(`${produit.nom} — charges mises à jour.`)
    })
  }

  return (
    <TableRow>
      <TableCell>
        <p className="text-sm font-medium">{produit.nom}</p>
        <p className="text-xs text-muted-foreground">{produit.sku}</p>
      </TableCell>
      {COLONNES.map(({ champ }) => (
        <TableCell key={champ}>
          <Input
            type="number"
            min={champ === "margePlancherPct" ? 20 : 0}
            step={0.1}
            className="h-8 w-20"
            value={valeurs[champ]}
            onChange={(e) =>
              setValeurs((v) => ({ ...v, [champ]: Number(e.target.value) }))
            }
          />
        </TableCell>
      ))}
      <TableCell>
        <Button size="sm" variant="outline" disabled={isPending} onClick={onSave}>
          {isPending ? "..." : "Enregistrer"}
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function ProductCostsTable({
  produits,
  orgSlug,
  workspaceSlug,
}: {
  produits: ReglagesCoutsProduit[]
  orgSlug: string
  workspaceSlug: string
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            {COLONNES.map(({ champ, label, suffixe }) => (
              <TableHead key={champ} className="whitespace-nowrap">
                {label} <span className="text-muted-foreground">({suffixe})</span>
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {produits.map((produit) => (
            <LigneProduit
              key={produit.productId}
              produit={produit}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-muted-foreground">
        Marge plancher = seuil de marge nette minimum (jamais en dessous de 20%) — garde-fou
        prévu pour le futur repricing automatique (Buy Box).
      </p>
    </div>
  )
}
