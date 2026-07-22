"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ajouterRetourAction } from "@/lib/actions/amazon.actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductCombobox } from "@/components/fournisseurs/product-combobox"
import type { ProduitSimple } from "@/modules/rentabilite/services/products.service"

const MOTIFS = [
  { valeur: "defectueux", libelle: "Produit défectueux" },
  { valeur: "ne_correspond_pas", libelle: "Ne correspond pas à la description" },
  { valeur: "taille_couleur", libelle: "Taille/couleur incorrecte" },
  { valeur: "change_avis", libelle: "A changé d'avis" },
  { valeur: "autre", libelle: "Autre" },
] as const

type Retour = { id: string; quantite: number; motif: string; cree_le: string; products: { nom: string } | { nom: string }[] | null }
type MotifFrequent = { motif: string; libelle: string; quantite: number }

const LABEL_MOTIF: Record<string, string> = Object.fromEntries(MOTIFS.map((m) => [m.valeur, m.libelle]))

export function ReturnsPanel({
  retours,
  motifsFrequents,
  produitsInitiaux,
  orgSlug,
  workspaceSlug,
}: {
  retours: Retour[]
  motifsFrequents: MotifFrequent[]
  produitsInitiaux: ProduitSimple[]
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [produits, setProduits] = useState(produitsInitiaux)
  const [productId, setProductId] = useState<string | null>(null)
  const [quantite, setQuantite] = useState("1")
  const [motif, setMotif] = useState<(typeof MOTIFS)[number]["valeur"]>("defectueux")
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!productId) {
      toast.error("Choisissez un produit.")
      return
    }
    startTransition(async () => {
      const resultat = await ajouterRetourAction(orgSlug, workspaceSlug, {
        productId,
        quantite: Number(quantite),
        motif,
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setProductId(null)
      setQuantite("1")
      router.refresh()
    })
  }

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-medium">
        Retours produits{" "}
        <span className="text-muted-foreground">— à saisir manuellement en attendant l&apos;API Retours Amazon</span>
      </p>

      <form onSubmit={onSubmit} className="mb-4 flex flex-wrap items-end gap-2">
        <div className="min-w-48 flex-1 space-y-1">
          <Label className="text-xs text-muted-foreground">Produit</Label>
          <ProductCombobox
            produits={produits}
            value={productId}
            orgSlug={orgSlug}
            workspaceSlug={workspaceSlug}
            onSelect={(p) => setProductId(p.id)}
            onProductCreated={(p) => setProduits((prev) => [...prev, p])}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Quantité</Label>
          <Input
            type="number"
            min={1}
            className="w-20"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Motif</Label>
          <select
            value={motif}
            onChange={(e) => setMotif(e.target.value as (typeof MOTIFS)[number]["valeur"])}
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          >
            {MOTIFS.map((m) => (
              <option key={m.valeur} value={m.valeur}>
                {m.libelle}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "..." : "Enregistrer le retour"}
        </Button>
      </form>

      {motifsFrequents.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {motifsFrequents.map((m) => (
            <span
              key={m.motif}
              className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground"
            >
              {m.libelle} · {m.quantite}
            </span>
          ))}
        </div>
      ) : null}

      {retours.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun retour enregistré.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {retours.map((r) => {
            const produit = Array.isArray(r.products) ? r.products[0] : r.products
            return (
              <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                <span>
                  {produit?.nom ?? "Produit"} — {LABEL_MOTIF[r.motif] ?? r.motif}
                </span>
                <span className="text-muted-foreground">
                  {r.quantite} unité(s) · {new Date(r.cree_le).toLocaleDateString("fr-FR")}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
