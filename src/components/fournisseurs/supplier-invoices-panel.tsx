"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  creerFactureAction,
  marquerFacturePayeeAction,
} from "@/lib/actions/fournisseurs.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type FactureFournisseurLigne = {
  id: string
  numero_facture: string
  montant: number
  statut: string
  date_emission: string
  date_echeance: string | null
  date_paiement: string | null
}

const VARIANT_STATUT: Record<string, "secondary" | "outline" | "destructive"> = {
  payee: "secondary",
  en_attente: "outline",
  en_retard: "destructive",
}

function NewInvoiceForm({
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
    numero_facture: "",
    montant: "",
    date_emission: new Date().toISOString().slice(0, 10),
    date_echeance: "",
  })
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await creerFactureAction(orgSlug, workspaceSlug, {
        supplier_id: supplierId,
        ...valeurs,
        montant: Number(valeurs.montant || 0),
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setValeurs({
        numero_facture: "",
        montant: "",
        date_emission: new Date().toISOString().slice(0, 10),
        date_echeance: "",
      })
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-border/60 p-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Numéro de facture</Label>
          <Input
            value={valeurs.numero_facture}
            onChange={(e) => setValeurs((v) => ({ ...v, numero_facture: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Montant (€)</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={valeurs.montant}
            onChange={(e) => setValeurs((v) => ({ ...v, montant: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Date d&apos;émission</Label>
          <Input
            type="date"
            value={valeurs.date_emission}
            onChange={(e) => setValeurs((v) => ({ ...v, date_emission: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Échéance</Label>
          <Input
            type="date"
            value={valeurs.date_echeance}
            onChange={(e) => setValeurs((v) => ({ ...v, date_echeance: e.target.value }))}
          />
        </div>
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={isPending || !valeurs.numero_facture.trim() || !valeurs.montant}
      >
        {isPending ? "Création..." : "Créer la facture"}
      </Button>
    </form>
  )
}

function MarquerPayeeButton({
  invoiceId,
  supplierId,
  orgSlug,
  workspaceSlug,
}: {
  invoiceId: string
  supplierId: string
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function onClick() {
    startTransition(async () => {
      const resultat = await marquerFacturePayeeAction(
        invoiceId,
        supplierId,
        orgSlug,
        workspaceSlug
      )
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  return (
    <Button size="xs" variant="outline" disabled={isPending} onClick={onClick}>
      {isPending ? "..." : "Marquer payée"}
    </Button>
  )
}

export function SupplierInvoicesPanel({
  supplierId,
  orgSlug,
  workspaceSlug,
  factures,
}: {
  supplierId: string
  orgSlug: string
  workspaceSlug: string
  factures: FactureFournisseurLigne[]
}) {
  return (
    <div className="space-y-4">
      <NewInvoiceForm supplierId={supplierId} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      {factures.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune facture pour ce fournisseur.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {factures.map((facture) => (
            <div key={facture.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="font-medium">{facture.numero_facture}</p>
                <p className="text-xs text-muted-foreground">
                  Émise le {new Date(facture.date_emission).toLocaleDateString("fr-FR")}
                  {facture.date_echeance
                    ? ` · Échéance le ${new Date(facture.date_echeance).toLocaleDateString("fr-FR")}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {facture.montant.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
                <Badge variant={VARIANT_STATUT[facture.statut] ?? "outline"}>
                  {facture.statut}
                </Badge>
                {facture.statut !== "payee" ? (
                  <MarquerPayeeButton
                    invoiceId={facture.id}
                    supplierId={supplierId}
                    orgSlug={orgSlug}
                    workspaceSlug={workspaceSlug}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
