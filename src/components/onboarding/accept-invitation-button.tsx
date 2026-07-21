"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { accepterInvitationAction } from "@/lib/actions/invitation.actions"
import { Button } from "@/components/ui/button"

export function AcceptInvitationButton({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      className="w-full"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const resultat = await accepterInvitationAction(token)
          if (resultat && !resultat.succes) {
            toast.error(resultat.message)
          }
        })
      }
    >
      {isPending ? "Acceptation..." : "Accepter l'invitation"}
    </Button>
  )
}
