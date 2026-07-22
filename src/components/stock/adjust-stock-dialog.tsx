"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ajusterStockAction } from "@/lib/actions/stock.actions"
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
import { cn } from "@/lib/utils"

const TYPES = [
  { valeur: "entree", libelle: "Entrée (réception)" },
  { valeur: "sortie", libelle: "Sortie" },
  { valeur: "ajustement", libelle: "Ajustement (nouvelle quantité)" },
] as const

export function AdjustStockDialog({
  productId,
  produitNom,
  orgSlug,
  workspaceSlug,
}: {
  productId: string
  produitNom: string
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<(typeof TYPES)[number]["valeur"]>("entree")
  const [quantite, setQuantite] = useState("")
  const [motif, setMotif] = useState("")
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await ajusterStockAction(orgSlug, workspaceSlug, productId, {
        type,
        quantite: Number(quantite),
        motif,
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setQuantite("")
      setMotif("")
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline">Ajuster</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuster le stock — {produitNom}</DialogTitle>
          <DialogDescription>
            Saisi manuellement en attendant la synchronisation FBA automatique.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-center gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t.valeur}
                type="button"
                onClick={() => setType(t.valeur)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs",
                  type === t.valeur
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/60 text-muted-foreground hover:bg-accent/60"
                )}
              >
                {t.libelle}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              {type === "ajustement" ? "Nouvelle quantité" : "Quantité"}
            </Label>
            <Input
              type="number"
              min={1}
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Motif</Label>
            <Input
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Réception fournisseur, inventaire, casse..."
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !quantite}>
              {isPending ? "Enregistrement..." : "Valider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
