"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { creerWorkspaceAction } from "@/lib/actions/workspace.actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type WorkspaceLigne = { id: string; nom: string; slug: string }

export function WorkspaceList({
  organizationId,
  orgSlug,
  workspaces,
  peutGerer,
}: {
  organizationId: string
  orgSlug: string
  workspaces: WorkspaceLigne[]
  peutGerer: boolean
}) {
  const router = useRouter()
  const [ouvert, setOuvert] = useState(false)
  const [nom, setNom] = useState("")
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await creerWorkspaceAction(organizationId, { nom })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      setNom("")
      setOuvert(false)
      router.push(`/${orgSlug}/${resultat.slug}/tableau-de-bord`)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {peutGerer ? (
        <div className="flex justify-end">
          <Dialog open={ouvert} onOpenChange={setOuvert}>
            <DialogTrigger
              render={
                <Button>
                  <Plus className="size-4" />
                  Nouveau workspace
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un workspace</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="workspace-nom">Nom</Label>
                  <Input
                    id="workspace-nom"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Entrepôt Nord"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Création..." : "Créer le workspace"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <Link key={workspace.id} href={`/${orgSlug}/${workspace.slug}/tableau-de-bord`}>
            <Card className="p-4 transition-colors hover:border-foreground/20">
              <p className="text-sm font-medium">{workspace.nom}</p>
              <p className="text-xs text-muted-foreground">/{workspace.slug}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
