"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export type NotificationApercu = {
  id: string
  titre: string
  message: string | null
  lien: string | null
  lue: boolean
  cree_le: string
}

export function TopbarNotifications({
  notifications,
  orgSlug,
  workspaceSlug,
}: {
  notifications: NotificationApercu[]
  orgSlug: string
  workspaceSlug: string
}) {
  const nonLues = notifications.filter((n) => !n.lue).length

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          >
            <Bell className="size-4" />
            {nonLues > 0 ? (
              <span className="absolute top-1 right-1 flex size-2 rounded-full bg-indigo-500" />
            ) : null}
          </button>
        }
      />
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
          <span className="text-sm font-medium">Notifications</span>
          {nonLues > 0 ? <Badge variant="secondary">{nonLues} non lues</Badge> : null}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification pour le moment.
            </p>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.lien ?? `/${orgSlug}/${workspaceSlug}/notifications`}
                  className="flex flex-col gap-0.5 border-b border-border/40 px-3 py-2.5 text-sm last:border-b-0 hover:bg-accent/50"
                >
                  <div className="flex items-center gap-2">
                    {!n.lue ? <span className="size-1.5 rounded-full bg-indigo-500" /> : null}
                    <span className="font-medium">{n.titre}</span>
                  </div>
                  {n.message ? (
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {n.message}
                    </span>
                  ) : null}
                  <span className="text-[11px] text-muted-foreground/70">
                    {formatDistanceToNow(new Date(n.cree_le), { addSuffix: true, locale: fr })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t border-border/60 p-2">
          <Button
            variant="ghost"
            className="w-full justify-center text-xs"
            render={<Link href={`/${orgSlug}/${workspaceSlug}/notifications`} />}
          >
            Voir toutes les notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
