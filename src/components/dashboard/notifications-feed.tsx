"use client"

import { useTransition } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { BellOff } from "lucide-react"

import {
  marquerNotificationLueAction,
  marquerToutesNotificationsLuesAction,
} from "@/lib/actions/notification.actions"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"

export type NotificationComplete = {
  id: string
  titre: string
  message: string | null
  lien: string | null
  lue: boolean
  cree_le: string
}

export function NotificationsFeed({
  notifications,
  orgSlug,
  workspaceSlug,
}: {
  notifications: NotificationComplete[]
  orgSlug: string
  workspaceSlug: string
}) {
  const [isPending, startTransition] = useTransition()
  const nonLues = notifications.filter((n) => !n.lue).length

  return (
    <div className="space-y-4">
      {nonLues > 0 ? (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await marquerToutesNotificationsLuesAction(orgSlug, workspaceSlug)
              })
            }
          >
            Tout marquer comme lu
          </Button>
        </div>
      ) : null}

      {notifications.length === 0 ? (
        <EmptyState icone={BellOff} titre="Aucune notification" />
      ) : (
        <div className="divide-y divide-border/60 rounded-lg border border-border/60">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.lien ?? `/${orgSlug}/${workspaceSlug}/notifications`}
              onClick={() => {
                if (!notification.lue) {
                  startTransition(async () => {
                    await marquerNotificationLueAction(notification.id, orgSlug, workspaceSlug)
                  })
                }
              }}
              className="flex items-start gap-3 px-4 py-3 text-sm hover:bg-accent/40"
            >
              {!notification.lue ? (
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500" />
              ) : (
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-transparent" />
              )}
              <div className="flex-1">
                <p className="font-medium">{notification.titre}</p>
                {notification.message ? (
                  <p className="text-muted-foreground">{notification.message}</p>
                ) : null}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.cree_le), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
