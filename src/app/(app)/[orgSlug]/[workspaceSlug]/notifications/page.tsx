import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { NotificationsFeed } from "@/components/dashboard/notifications-feed"
import { listerNotificationsUtilisateur } from "@/modules/dashboard/services/productivity.service"

export const metadata: Metadata = { title: "Notifications — Pilot" }

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const notifications = await listerNotificationsUtilisateur(50)

  return (
    <>
      <PageHeader titre="Notifications" description="Toute votre activité récente" />
      <div className="p-6">
        <NotificationsFeed
          notifications={notifications}
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
        />
      </div>
    </>
  )
}
