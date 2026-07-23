"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Banknote, FileText, Sparkles } from "lucide-react"

import {
  genererDossierAction,
  marquerRecupereeAction,
  marquerSoumiseAction,
} from "@/lib/actions/reimbursements.actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Reclamation = {
  id: string
  quantite: number
  montant_estime: number
  statut: "detecte" | "dossier_pret" | "soumis" | "recupere" | "rejete"
  dossier_texte: string | null
  cree_le: string
  libelleType: string
  products: { nom: string; sku: string } | { nom: string; sku: string }[] | null
}

const LABEL_STATUT: Record<Reclamation["statut"], string> = {
  detecte: "Détecté",
  dossier_pret: "Dossier prêt",
  soumis: "Soumis à Amazon",
  recupere: "Récupéré",
  rejete: "Rejeté",
}

const VARIANT_STATUT: Record<Reclamation["statut"], "secondary" | "default" | "outline" | "destructive"> = {
  detecte: "secondary",
  dossier_pret: "default",
  soumis: "outline",
  recupere: "outline",
  rejete: "destructive",
}

function formatEur(valeur: number) {
  return valeur.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
}

export function ReimbursementsPanel({
  reclamations,
  montantRecuperable,
  montantRecupere,
  orgSlug,
  workspaceSlug,
}: {
  reclamations: Reclamation[]
  montantRecuperable: number
  montantRecupere: number
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [dossierOuvert, setDossierOuvert] = useState<Reclamation | null>(null)
  const [isPending, startTransition] = useTransition()

  function genererDossier(claimId: string) {
    startTransition(async () => {
      const resultat = await genererDossierAction(orgSlug, workspaceSlug, claimId)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  function marquerSoumis(claimId: string) {
    startTransition(async () => {
      const resultat = await marquerSoumiseAction(orgSlug, workspaceSlug, claimId)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setDossierOuvert(null)
      router.refresh()
    })
  }

  function marquerRecupere(claimId: string) {
    startTransition(async () => {
      const resultat = await marquerRecupereeAction(orgSlug, workspaceSlug, claimId)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Banknote className="size-4 text-primary" />
            Fonds récupérables auprès d&apos;Amazon
          </p>
          <p className="text-xs text-muted-foreground">
            Détecté à partir des écarts de stock et remboursements — le dossier est
            rédigé par l&apos;IA, l&apos;envoi à Amazon reste manuel (aucune API de dépôt
            de réclamation n&apos;existe côté Amazon).
          </p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-xs text-muted-foreground">À récupérer</p>
            <p className="text-xl font-bold text-primary">{formatEur(montantRecuperable)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Déjà récupéré</p>
            <p className="text-xl font-bold">{formatEur(montantRecupere)}</p>
          </div>
        </div>
      </div>

      {reclamations.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun écart détecté pour l&apos;instant.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {reclamations.map((r) => {
            const produit = Array.isArray(r.products) ? r.products[0] : r.products
            return (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <div>
                  <p className="font-medium">
                    {produit?.nom ?? "Produit"} — {r.libelleType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.quantite} unité(s) · {formatEur(Number(r.montant_estime))} ·{" "}
                    {new Date(r.cree_le).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={VARIANT_STATUT[r.statut]}>{LABEL_STATUT[r.statut]}</Badge>
                  {r.statut === "detecte" ? (
                    <Button size="sm" variant="outline" disabled={isPending} onClick={() => genererDossier(r.id)}>
                      <Sparkles className="size-3.5" />
                      Générer le dossier
                    </Button>
                  ) : null}
                  {r.dossier_texte && r.statut !== "recupere" && r.statut !== "rejete" ? (
                    <Button size="sm" variant="outline" onClick={() => setDossierOuvert(r)}>
                      <FileText className="size-3.5" />
                      Voir le dossier
                    </Button>
                  ) : null}
                  {r.statut === "soumis" ? (
                    <Button size="sm" disabled={isPending} onClick={() => marquerRecupere(r.id)}>
                      Marquer récupéré
                    </Button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={dossierOuvert !== null} onOpenChange={(open) => !open && setDossierOuvert(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Dossier de réclamation</DialogTitle>
            <DialogDescription>
              Rédigé par l&apos;IA — à copier dans le Case Log de Seller Central pour
              soumission (Amazon ne propose pas de dépôt automatique).
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-96 overflow-y-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap">
            {dossierOuvert?.dossier_texte}
          </pre>
          <DialogFooter>
            {dossierOuvert?.statut === "dossier_pret" ? (
              <Button disabled={isPending} onClick={() => dossierOuvert && marquerSoumis(dossierOuvert.id)}>
                {isPending ? "..." : "Marquer comme soumis à Amazon"}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
