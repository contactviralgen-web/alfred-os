"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X } from "lucide-react"

import { revoquerInvitationAction } from "@/lib/actions/invitation.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type InvitationLigne = {
  id: string
  email: string
  statut: string
  cree_le: string
  roles: { nom: string } | null
}

export function InvitationsList({ invitations }: { invitations: InvitationLigne[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const enAttente = invitations.filter((i) => i.statut === "en_attente")

  if (enAttente.length === 0) return null

  return (
    <div className="mt-6 space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Invitations en attente</p>
      <div className="divide-y divide-border/60 rounded-lg border border-border/60">
        {enAttente.map((invitation) => (
          <div key={invitation.id} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">{invitation.email}</span>
              <Badge variant="outline">{invitation.roles?.nom ?? "—"}</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const resultat = await revoquerInvitationAction(invitation.id)
                  if (!resultat.succes) {
                    toast.error(resultat.message)
                    return
                  }
                  router.refresh()
                })
              }
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
