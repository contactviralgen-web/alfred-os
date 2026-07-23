"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { creerProduitAction } from "@/lib/actions/produits.actions"
import type { ProduitSimple } from "@/modules/rentabilite/services/products.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const VALEURS_INITIALES = {
  sku: "",
  nom: "",
  categorie: "",
  prix_achat: "",
  prix_vente: "",
  marge_plancher_pct: "20",
}

export function NewProductDialog({
  orgSlug,
  workspaceSlug,
  open,
  onOpenChange,
  trigger,
  onCreated,
}: {
  orgSlug: string
  workspaceSlug: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactElement
  onCreated?: (produit: ProduitSimple) => void
}) {
  const router = useRouter()
  const [openInterne, setOpenInterne] = useState(false)
  const [valeurs, setValeurs] = useState(VALEURS_INITIALES)
  const [isPending, startTransition] = useTransition()

  const estOuvert = open ?? openInterne
  const changerOuverture = onOpenChange ?? setOpenInterne

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await creerProduitAction(orgSlug, workspaceSlug, valeurs)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(`Produit "${resultat.produit.nom}" créé.`)
      setValeurs(VALEURS_INITIALES)
      changerOuverture(false)
      if (onCreated) {
        onCreated(resultat.produit)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={estOuvert} onOpenChange={changerOuverture}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" variant="outline">
              <Plus />
              Nouveau produit
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau produit</DialogTitle>
          <DialogDescription>
            Le nom, le SKU et le prix de vente seront synchronisés automatiquement une fois
            Amazon connecté. Le prix d&apos;achat et la catégorie restent toujours à saisir
            vous-même.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">SKU</Label>
              <Input
                value={valeurs.sku}
                onChange={(e) => setValeurs((v) => ({ ...v, sku: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Catégorie</Label>
              <Input
                value={valeurs.categorie}
                onChange={(e) => setValeurs((v) => ({ ...v, categorie: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Nom du produit</Label>
            <Input
              value={valeurs.nom}
              onChange={(e) => setValeurs((v) => ({ ...v, nom: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Prix d&apos;achat (€)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={valeurs.prix_achat}
                onChange={(e) => setValeurs((v) => ({ ...v, prix_achat: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Prix de vente (€)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={valeurs.prix_vente}
                onChange={(e) => setValeurs((v) => ({ ...v, prix_vente: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Marge nette plancher (%)</Label>
            <Input
              type="number"
              min={20}
              max={90}
              step={1}
              value={valeurs.marge_plancher_pct}
              onChange={(e) => setValeurs((v) => ({ ...v, marge_plancher_pct: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Seuil de marge nette minimum (après achat, transport, douane, frais Amazon/FBA et
              TVA) — jamais inférieur à 20%. Garde-fou pour le futur repricing automatique.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !valeurs.sku.trim() || !valeurs.nom.trim()}
            >
              {isPending ? "Création..." : "Créer le produit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
