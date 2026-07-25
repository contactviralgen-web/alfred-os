"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Megaphone } from "lucide-react"

import { connecterPubAction, deconnecterPubAction } from "@/lib/actions/ads.actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ConnexionPub } from "@/connectors/ads/ads.service"
import { LABEL_PLATEFORME, type PlateformePub } from "@/connectors/ads/ads.constants"

export function AdsConnectionCards({
  connexions,
  orgSlug,
  workspaceSlug,
}: {
  connexions: ConnexionPub[]
  orgSlug: string
  workspaceSlug: string
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {connexions.map((connexion) => (
        <AdsConnectionCard
          key={connexion.plateforme}
          connexion={connexion}
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
        />
      ))}
    </div>
  )
}

function AdsConnectionCard({
  connexion,
  orgSlug,
  workspaceSlug,
}: {
  connexion: ConnexionPub
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const plateforme: PlateformePub = connexion.plateforme

  function connecter() {
    startTransition(async () => {
      const resultat = await connecterPubAction(orgSlug, workspaceSlug, plateforme)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  function deconnecter() {
    startTransition(async () => {
      const resultat = await deconnecterPubAction(orgSlug, workspaceSlug, plateforme)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  const connecte = connexion.statut === "connecte"

  return (
    <Card className="flex-row items-center gap-4 border border-border/60 p-4 transition-colors duration-200 hover:border-primary/30">
      <span
        className={`flex size-10 items-center justify-center rounded-full ${connecte ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
      >
        <Megaphone className="size-5" />
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{LABEL_PLATEFORME[plateforme]}</p>
          {connecte ? <Badge variant="secondary">Démo</Badge> : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {connecte ? `Compte ${connexion.compteId}` : "Non connecté"}
        </p>
      </div>
      <Button size="sm" variant={connecte ? "outline" : "default"} disabled={isPending} onClick={connecte ? deconnecter : connecter}>
        {connecte ? "Déconnecter" : "Connecter"}
      </Button>
    </Card>
  )
}
