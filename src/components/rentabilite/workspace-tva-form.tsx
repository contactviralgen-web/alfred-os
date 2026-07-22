"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { mettreAJourReglagesWorkspaceAction } from "@/lib/actions/rentabilite.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"

export function WorkspaceTvaForm({
  orgSlug,
  workspaceSlug,
  tauxTvaPct,
  prixTtc,
}: {
  orgSlug: string
  workspaceSlug: string
  tauxTvaPct: number
  prixTtc: boolean
}) {
  const [taux, setTaux] = useState(String(tauxTvaPct))
  const [ttc, setTtc] = useState(prixTtc)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await mettreAJourReglagesWorkspaceAction(orgSlug, workspaceSlug, {
        taux_tva_pct: Number(taux),
        prix_ttc: ttc,
      })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
    })
  }

  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Taux de TVA (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            step={0.5}
            className="w-28"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={ttc} onCheckedChange={setTtc} id="prix-ttc" />
          <Label htmlFor="prix-ttc" className="text-sm">
            Les prix de vente saisis sont TTC
          </Label>
        </div>
        <Button type="submit" size="sm" variant="outline" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Card>
  )
}
