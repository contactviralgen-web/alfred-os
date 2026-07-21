"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { mettreAJourContactAction } from "@/lib/actions/crm.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ContactHeaderForm({
  contactId,
  orgSlug,
  workspaceSlug,
  prenom,
  nom,
  email,
  telephone,
}: {
  contactId: string
  orgSlug: string
  workspaceSlug: string
  prenom: string | null
  nom: string | null
  email: string | null
  telephone: string | null
}) {
  const [valeurs, setValeurs] = useState({
    prenom: prenom ?? "",
    nom: nom ?? "",
    email: email ?? "",
    telephone: telephone ?? "",
  })
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await mettreAJourContactAction(
        contactId,
        orgSlug,
        workspaceSlug,
        valeurs
      )
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Prénom</Label>
        <Input
          value={valeurs.prenom}
          onChange={(e) => setValeurs((v) => ({ ...v, prenom: e.target.value }))}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Nom</Label>
        <Input
          value={valeurs.nom}
          onChange={(e) => setValeurs((v) => ({ ...v, nom: e.target.value }))}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Email</Label>
        <Input
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
      <Button type="submit" size="sm" variant="outline" disabled={isPending} className="w-fit">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
