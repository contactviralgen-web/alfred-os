import { CommandPalette } from "@/components/layout/command-palette"
import { MobileNav } from "@/components/layout/sidebar/mobile-nav"
import {
  TopbarNotifications,
  type NotificationApercu,
} from "@/components/layout/topbar/topbar-notifications"
import { TopbarUserMenu } from "@/components/layout/topbar/topbar-user-menu"
import { ThemeToggleButton } from "@/components/shared/theme-toggle"

export function Topbar({
  orgSlug,
  workspaceSlug,
  nom,
  email,
  notifications,
}: {
  orgSlug: string
  workspaceSlug: string
  nom: string | null
  email: string
  notifications: NotificationApercu[]
}) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md">
      <MobileNav orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      <div className="flex flex-1 justify-start">
        <CommandPalette orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        <TopbarNotifications
          notifications={notifications}
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
        />
        <TopbarUserMenu nom={nom} email={email} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      </div>
    </header>
  )
}
