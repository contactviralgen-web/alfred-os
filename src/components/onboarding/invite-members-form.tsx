"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { envoyerInvitationAction } from "@/lib/actions/invitation.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InviteMembersForm({
  organizationId,
  organizationSlug,
  workspaceSlug,
  roleMembreId,
}: {
  organizationId: string
  organizationSlug: string
  workspaceSlug: string
  roleMembreId: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function continuer() {
    router.push(`/${organizationSlug}/${workspaceSlug}/tableau-de-bord`)
  }

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const emails = [
        formData.get("email1"),
        formData.get("email2"),
        formData.get("email3"),
      ]
        .map((valeur) => (typeof valeur === "string" ? valeur.trim() : ""))
        .filter(Boolean)

      if (emails.length === 0) {
        continuer()
        return
      }

      const resultats = await Promise.all(
        emails.map((email) =>
          envoyerInvitationAction(organizationId, { email, roleId: roleMembreId })
        )
      )

      const echecs = resultats.filter((r) => !r.succes)
      if (echecs.length > 0) {
        toast.error(`${echecs.length} invitation(s) n'ont pas pu être envoyées.`)
        return
      }

      toast.success("Invitations envoyées.")
      continuer()
    })
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="space-y-1.5">
            <Label htmlFor={`email${n}`}>Email {n}</Label>
            <Input
              id={`email${n}`}
              name={`email${n}`}
              type="email"
              placeholder="collegue@entreprise.com"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Envoi..." : "Inviter et continuer"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={continuer}
          disabled={isPending}
        >
          Passer cette étape
        </Button>
      </div>
    </form>
  )
}
