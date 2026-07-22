"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  creerCommandeFournisseurAction,
  mettreAJourStatutCommandeAction,
} from "@/lib/actions/fournisseurs.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type CommandeFournisseurLigne = {
  id: string
  numero_commande: string
  statut: string
  montant_total: number
  date_commande: string
  date_livraison_prevue: string | null
  date_livraison_reelle: string | null
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

function NewOrderForm({
  supplierId,
  orgSlug,
  workspaceSlug,
}: {
  supplierId: string
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [valeurs, setValeurs] = useState({
    numero_commande: "",
    montant_total: "",
    date_commande: new Date().toISOString().slice(0, 10),
    date_livraison_prevue: "",
    notes: "",
  })
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await creerCommandeFournisseurAction(orgSlug, workspaceSlug, {
        supplier_id: supplierId,
        ...valeurs,
        montant_total: valeurs.montant_total ? Number(valeurs.montant_total) : 0,
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setValeurs({
        numero_commande: "",
        montant_total: "",
        date_commande: new Date().toISOString().slice(0, 10),
        date_livraison_prevue: "",
        notes: "",
      })
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
          <Label className="text-xs text-muted-foreground">Montant total (€)</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={valeurs.montant_total}
            onChange={(e) => setValeurs((v) => ({ ...v, montant_total: e.target.value }))}
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
}: {
  supplierId: string
  orgSlug: string
  workspaceSlug: string
  commandes: CommandeFournisseurLigne[]
}) {
  return (
    <div className="space-y-4">
      <NewOrderForm supplierId={supplierId} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
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
                    {enRetard ? (
                      <span className="ml-1 text-destructive">(en retard)</span>
                    ) : null}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {commande.montant_total.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  <Badge
                    variant={VARIANT_STATUT[commande.statut] ?? "outline"}
                    className={cn(commande.statut === "en_transit" && "bg-blue-600")}
                  >
                    {commande.statut}
                  </Badge>
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
