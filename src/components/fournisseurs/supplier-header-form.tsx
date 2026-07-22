"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { mettreAJourFournisseurAction } from "@/lib/actions/fournisseurs.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function SupplierHeaderForm({
  supplierId,
  orgSlug,
  workspaceSlug,
  nom,
  email,
  telephone,
  adresse,
  statut,
  delaiLivraisonJours,
  notePerformance,
}: {
  supplierId: string
  orgSlug: string
  workspaceSlug: string
  nom: string
  email: string | null
  telephone: string | null
  adresse: string | null
  statut: string
  delaiLivraisonJours: number | null
  notePerformance: number | null
}) {
  const [valeurs, setValeurs] = useState({
    nom,
    email: email ?? "",
    telephone: telephone ?? "",
    adresse: adresse ?? "",
    statut,
    delai_livraison_jours: delaiLivraisonJours != null ? String(delaiLivraisonJours) : "",
    note_performance: notePerformance != null ? String(notePerformance) : "",
  })
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await mettreAJourFournisseurAction(supplierId, orgSlug, workspaceSlug, {
        nom: valeurs.nom,
        email: valeurs.email,
        telephone: valeurs.telephone,
        adresse: valeurs.adresse,
        statut: valeurs.statut,
        delai_livraison_jours: valeurs.delai_livraison_jours
          ? Number(valeurs.delai_livraison_jours)
          : null,
        note_performance: valeurs.note_performance ? Number(valeurs.note_performance) : null,
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Adresse</Label>
          <Input
            value={valeurs.adresse}
            onChange={(e) => setValeurs((v) => ({ ...v, adresse: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Délai livraison (jours)</Label>
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
          <Label className="text-xs text-muted-foreground">Note performance (0-5)</Label>
          <Input
            type="number"
            min={0}
            max={5}
            step={0.5}
            value={valeurs.note_performance}
            onChange={(e) => setValeurs((v) => ({ ...v, note_performance: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {(["actif", "inactif"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setValeurs((v) => ({ ...v, statut: s }))}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs capitalize",
              valeurs.statut === s
                ? "border-foreground bg-foreground text-background"
                : "border-border/60 text-muted-foreground hover:bg-accent/60"
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={isPending} className="w-fit">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
