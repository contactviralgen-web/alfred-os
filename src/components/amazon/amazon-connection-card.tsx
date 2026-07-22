"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShoppingCart } from "lucide-react"

import { connecterAmazonAction, deconnecterAmazonAction } from "@/lib/actions/amazon.actions"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ConnexionAmazon } from "@/modules/amazon/services/amazon.service"

export function AmazonConnectionCard({
  connexion,
  orgSlug,
  workspaceSlug,
}: {
  connexion: ConnexionAmazon
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function connecter() {
    startTransition(async () => {
      const resultat = await connecterAmazonAction(orgSlug, workspaceSlug)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setOpen(false)
      router.refresh()
    })
  }

  function deconnecter() {
    startTransition(async () => {
      const resultat = await deconnecterAmazonAction(orgSlug, workspaceSlug)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  if (connexion.statut === "connecte") {
    return (
      <Card className="flex items-center gap-4 p-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
          <ShoppingCart className="size-5" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Compte Amazon connecté</p>
            <Badge variant="secondary">Démo</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Seller ID {connexion.sellerId} — Marketplaces : {connexion.marketplaces.join(", ")}
          </p>
        </div>
        <Button size="sm" variant="outline" disabled={isPending} onClick={deconnecter}>
          Déconnecter
        </Button>
      </Card>
    )
  }

  return (
    <Card className="flex items-center gap-4 p-4">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ShoppingCart className="size-5" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">Compte Amazon non connecté</p>
        <p className="text-xs text-muted-foreground">
          Connectez votre compte pour synchroniser produits, commandes et frais.
        </p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button size="sm">Connecter mon compte Amazon</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connecter mon compte Amazon</DialogTitle>
            <DialogDescription>
              Cette connexion est simulée pour la démo : aucune donnée n&apos;est transmise à
              Amazon. Une fois l&apos;accès SP-API réel obtenu, cette même page se connectera
              pour de vrai sans changement d&apos;interface.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isPending} onClick={connecter}>
              {isPending ? "Connexion..." : "Simuler la connexion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
