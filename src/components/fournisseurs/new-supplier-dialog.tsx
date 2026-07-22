"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { creerFournisseurAction } from "@/lib/actions/fournisseurs.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  nom: "",
  email: "",
  telephone: "",
  adresse: "",
  delai_livraison_jours: "",
  notes: "",
}

export function NewSupplierDialog({
  orgSlug,
  workspaceSlug,
}: {
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [valeurs, setValeurs] = useState(VALEURS_INITIALES)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await creerFournisseurAction(orgSlug, workspaceSlug, {
        ...valeurs,
        delai_livraison_jours: valeurs.delai_livraison_jours
          ? Number(valeurs.delai_livraison_jours)
          : null,
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setValeurs(VALEURS_INITIALES)
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus />
            Nouveau fournisseur
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau fournisseur</DialogTitle>
          <DialogDescription>
            Ajoutez un fournisseur pour suivre vos commandes d&apos;achat et factures.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Nom</Label>
            <Input
              value={valeurs.nom}
              onChange={(e) => setValeurs((v) => ({ ...v, nom: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={valeurs.email}
                onChange={(e) => setValeurs((v) => ({ ...v, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Téléphone</Label>
              <Input
                value={valeurs.telephone}
                onChange={(e) => setValeurs((v) => ({ ...v, telephone: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Adresse</Label>
            <Input
              value={valeurs.adresse}
              onChange={(e) => setValeurs((v) => ({ ...v, adresse: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Délai de livraison (jours)</Label>
            <Input
              type="number"
              min={0}
              value={valeurs.delai_livraison_jours}
              onChange={(e) =>
                setValeurs((v) => ({ ...v, delai_livraison_jours: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Textarea
              value={valeurs.notes}
              onChange={(e) => setValeurs((v) => ({ ...v, notes: e.target.value }))}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !valeurs.nom.trim()}>
              {isPending ? "Création..." : "Créer le fournisseur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
