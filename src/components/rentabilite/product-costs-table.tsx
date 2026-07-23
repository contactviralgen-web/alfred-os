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
import { calculerPrixPlancher, type ReglagesCoutsProduit } from "@/modules/rentabilite/services/margins.pure"

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

function formatEur(valeur: number) {
  if (!Number.isFinite(valeur)) return "—"
  return valeur.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
}

function LigneProduit({
  produit,
  tauxTvaPct,
  orgSlug,
  workspaceSlug,
}: {
  produit: ReglagesCoutsProduit
  tauxTvaPct: number
  orgSlug: string
  workspaceSlug: string
}) {
  const [valeurs, setValeurs] = useState(produit)
  const [isPending, startTransition] = useTransition()

  const prixPlancher = calculerPrixPlancher({
    prixAchat: valeurs.prixAchat,
    coutTransportFlat: valeurs.coutTransportFlat,
    coutDouaneFlat: valeurs.coutDouaneFlat,
    fraisFbaFlat: valeurs.fraisFbaFlat,
    fraisStockageUnitaireFlat: valeurs.fraisStockageUnitaireFlat,
    coutDiversFlat: valeurs.coutDiversFlat,
    fraisAmazonPct: valeurs.fraisAmazonPct,
    tauxRetourPct: valeurs.tauxRetourPct,
    margePlancherPct: valeurs.margePlancherPct,
    tauxTvaPct,
  })

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
            min={0}
            step={0.1}
            className="h-8 w-20"
            value={valeurs[champ]}
            onChange={(e) =>
              setValeurs((v) => ({ ...v, [champ]: Number(e.target.value) }))
            }
          />
        </TableCell>
      ))}
      <TableCell className="text-sm font-medium text-primary whitespace-nowrap">
        {formatEur(prixPlancher)}
      </TableCell>
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
  tauxTvaPct,
  orgSlug,
  workspaceSlug,
}: {
  produits: ReglagesCoutsProduit[]
  tauxTvaPct: number
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
            <TableHead className="whitespace-nowrap">Prix plancher</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {produits.map((produit) => (
            <LigneProduit
              key={produit.productId}
              produit={produit}
              tauxTvaPct={tauxTvaPct}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-muted-foreground">
        Prix plancher = prix minimum en dessous duquel la marge nette tomberait sous le seuil
        choisi — garde-fou prévu pour le futur repricing automatique (Buy Box).
      </p>
    </div>
  )
}
