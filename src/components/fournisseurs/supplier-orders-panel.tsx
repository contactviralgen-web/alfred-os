"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

import {
  creerCommandeFournisseurAction,
  marquerCommandeRecueAction,
  mettreAJourStatutCommandeAction,
} from "@/lib/actions/fournisseurs.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductCombobox } from "@/components/fournisseurs/product-combobox"
import { cn } from "@/lib/utils"
import type { ProduitSimple } from "@/modules/rentabilite/services/products.service"

export type CommandeFournisseurLigne = {
  id: string
  numero_commande: string
  statut: string
  montant_total: number
  date_commande: string
  date_livraison_prevue: string | null
  date_livraison_reelle: string | null
  date_paiement_prevue: string | null
}

const STATUTS = [
  "brouillon",
  "envoyee",
  "confirmee",
  "en_transit",
  "livree",
  "annulee",
] as const

const VARIANT_STATUT: Record<string, "secondary" | "outline" | "destructive" | "default"> = {
  brouillon: "outline",
  envoyee: "outline",
  confirmee: "secondary",
  en_transit: "default",
  livree: "secondary",
  annulee: "destructive",
}

function formaterEuros(valeur: number) {
  return valeur.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
}

function StatutCommandeSelecteur({
  orderId,
  supplierId,
  orgSlug,
  workspaceSlug,
  statutActuel,
}: {
  orderId: string
  supplierId: string
  orgSlug: string
  workspaceSlug: string
  statutActuel: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function changerStatut(statut: (typeof STATUTS)[number]) {
    if (statut === statutActuel) return
    startTransition(async () => {
      const dateLivraisonReelle =
        statut === "livree" ? new Date().toISOString().slice(0, 10) : undefined
      const resultat = await mettreAJourStatutCommandeAction(
        orderId,
        supplierId,
        orgSlug,
        workspaceSlug,
        { statut, date_livraison_reelle: dateLivraisonReelle }
      )
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      router.refresh()
    })
  }

  return (
    <select
      value={statutActuel}
      disabled={isPending}
      onChange={(e) => changerStatut(e.target.value as (typeof STATUTS)[number])}
      className="h-7 rounded-lg border border-border/60 bg-background px-2 text-xs disabled:opacity-50"
    >
      {STATUTS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}

function BoutonMarquerRecue({
  orderId,
  supplierId,
  orgSlug,
  workspaceSlug,
}: {
  orderId: string
  supplierId: string
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function marquerRecue() {
    startTransition(async () => {
      const resultat = await marquerCommandeRecueAction(orderId, supplierId, orgSlug, workspaceSlug)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  return (
    <Button size="sm" variant="outline" disabled={isPending} onClick={marquerRecue}>
      {isPending ? "..." : "Marquer reçu"}
    </Button>
  )
}

type LigneEnCours = { productId: string | null; quantite: string; prixUnitaire: string }

function NewOrderForm({
  supplierId,
  orgSlug,
  workspaceSlug,
  produitsInitiaux,
}: {
  supplierId: string
  orgSlug: string
  workspaceSlug: string
  produitsInitiaux: ProduitSimple[]
}) {
  const router = useRouter()
  const [produits, setProduits] = useState(produitsInitiaux)
  const [valeurs, setValeurs] = useState({
    numero_commande: "",
    date_commande: new Date().toISOString().slice(0, 10),
    date_livraison_prevue: "",
    date_paiement_prevue: "",
    notes: "",
  })
  const [lignes, setLignes] = useState<LigneEnCours[]>([
    { productId: null, quantite: "1", prixUnitaire: "" },
  ])
  const [isPending, startTransition] = useTransition()

  const total = lignes.reduce(
    (somme, l) => somme + (Number(l.quantite) || 0) * (Number(l.prixUnitaire) || 0),
    0
  )

  function ajouterLigne() {
    setLignes((prev) => [...prev, { productId: null, quantite: "1", prixUnitaire: "" }])
  }

  function retirerLigne(index: number) {
    setLignes((prev) => prev.filter((_, i) => i !== index))
  }

  function selectionnerProduit(index: number, produit: ProduitSimple) {
    setLignes((prev) =>
      prev.map((l, i) =>
        i === index
          ? { ...l, productId: produit.id, prixUnitaire: l.prixUnitaire || String(produit.prixAchat) }
          : l
      )
    )
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const lignesValides = lignes.filter((l) => l.productId)
    if (lignesValides.length === 0) {
      toast.error("Ajoutez au moins un produit à la commande.")
      return
    }

    startTransition(async () => {
      const resultat = await creerCommandeFournisseurAction(orgSlug, workspaceSlug, {
        supplier_id: supplierId,
        numero_commande: valeurs.numero_commande,
        date_commande: valeurs.date_commande,
        date_livraison_prevue: valeurs.date_livraison_prevue,
        date_paiement_prevue: valeurs.date_paiement_prevue,
        notes: valeurs.notes,
        lignes: lignesValides.map((l) => ({
          product_id: l.productId,
          quantite: Number(l.quantite) || 1,
          prix_unitaire: Number(l.prixUnitaire) || 0,
        })),
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setValeurs({
        numero_commande: "",
        date_commande: new Date().toISOString().slice(0, 10),
        date_livraison_prevue: "",
        date_paiement_prevue: "",
        notes: "",
      })
      setLignes([{ productId: null, quantite: "1", prixUnitaire: "" }])
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-border/60 p-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Numéro de commande</Label>
          <Input
            value={valeurs.numero_commande}
            onChange={(e) => setValeurs((v) => ({ ...v, numero_commande: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Date de commande</Label>
          <Input
            type="date"
            value={valeurs.date_commande}
            onChange={(e) => setValeurs((v) => ({ ...v, date_commande: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Livraison prévue</Label>
          <Input
            type="date"
            value={valeurs.date_livraison_prevue}
            onChange={(e) =>
              setValeurs((v) => ({ ...v, date_livraison_prevue: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Paiement prévu</Label>
          <Input
            type="date"
            value={valeurs.date_paiement_prevue}
            onChange={(e) =>
              setValeurs((v) => ({ ...v, date_paiement_prevue: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Produits commandés</Label>
        {lignes.map((ligne, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <ProductCombobox
                produits={produits}
                value={ligne.productId}
                orgSlug={orgSlug}
                workspaceSlug={workspaceSlug}
                onSelect={(produit) => selectionnerProduit(index, produit)}
                onProductCreated={(produit) => setProduits((prev) => [...prev, produit])}
              />
            </div>
            <Input
              type="number"
              min={1}
              className="w-20"
              value={ligne.quantite}
              onChange={(e) =>
                setLignes((prev) =>
                  prev.map((l, i) => (i === index ? { ...l, quantite: e.target.value } : l))
                )
              }
            />
            <Input
              type="number"
              min={0}
              step={0.01}
              className="w-24"
              placeholder="Prix unit."
              value={ligne.prixUnitaire}
              onChange={(e) =>
                setLignes((prev) =>
                  prev.map((l, i) => (i === index ? { ...l, prixUnitaire: e.target.value } : l))
                )
              }
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={lignes.length === 1}
              onClick={() => retirerLigne(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={ajouterLigne}>
          <Plus />
          Ajouter un produit
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
        <span className="text-muted-foreground">Total commande</span>
        <span className="font-medium">{formaterEuros(total)}</span>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Notes</Label>
        <Textarea
          value={valeurs.notes}
          onChange={(e) => setValeurs((v) => ({ ...v, notes: e.target.value }))}
          rows={2}
        />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={isPending || !valeurs.numero_commande.trim()}
      >
        {isPending ? "Création..." : "Créer la commande"}
      </Button>
    </form>
  )
}

export function SupplierOrdersPanel({
  supplierId,
  orgSlug,
  workspaceSlug,
  commandes,
  produits,
}: {
  supplierId: string
  orgSlug: string
  workspaceSlug: string
  commandes: CommandeFournisseurLigne[]
  produits: ProduitSimple[]
}) {
  return (
    <div className="space-y-4">
      <NewOrderForm
        supplierId={supplierId}
        orgSlug={orgSlug}
        workspaceSlug={workspaceSlug}
        produitsInitiaux={produits}
      />
      {commandes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune commande pour ce fournisseur.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {commandes.map((commande) => {
            const enRetard =
              commande.statut !== "livree" &&
              commande.statut !== "annulee" &&
              commande.date_livraison_prevue &&
              new Date(commande.date_livraison_prevue) < new Date()
            return (
              <div key={commande.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium">{commande.numero_commande}</p>
                  <p className="text-xs text-muted-foreground">
                    Commandée le{" "}
                    {new Date(commande.date_commande).toLocaleDateString("fr-FR")}
                    {commande.date_livraison_prevue
                      ? ` · Prévue le ${new Date(commande.date_livraison_prevue).toLocaleDateString("fr-FR")}`
                      : ""}
                    {commande.date_paiement_prevue
                      ? ` · Paiement le ${new Date(commande.date_paiement_prevue).toLocaleDateString("fr-FR")}`
                      : ""}
                    {enRetard ? (
                      <span className="ml-1 text-destructive">(en retard)</span>
                    ) : null}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formaterEuros(commande.montant_total)}</span>
                  <Badge
                    variant={VARIANT_STATUT[commande.statut] ?? "outline"}
                    className={cn(commande.statut === "en_transit" && "bg-blue-600")}
                  >
                    {commande.statut}
                  </Badge>
                  {commande.statut !== "livree" && commande.statut !== "annulee" ? (
                    <BoutonMarquerRecue
                      orderId={commande.id}
                      supplierId={supplierId}
                      orgSlug={orgSlug}
                      workspaceSlug={workspaceSlug}
                    />
                  ) : null}
                  <StatutCommandeSelecteur
                    orderId={commande.id}
                    supplierId={supplierId}
                    orgSlug={orgSlug}
                    workspaceSlug={workspaceSlug}
                    statutActuel={commande.statut}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
