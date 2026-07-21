import { AppShellProvider, type ContexteApplicatif } from "@/components/layout/app-shell-context"
import { Sidebar } from "@/components/layout/sidebar/sidebar"
import { Topbar } from "@/components/layout/topbar/topbar"
import type { OrganisationSwitcherItem } from "@/components/layout/sidebar/sidebar-org-switcher"
import type { WorkspaceSwitcherItem } from "@/components/layout/sidebar/sidebar-workspace-switcher"
import type { NotificationApercu } from "@/components/layout/topbar/topbar-notifications"

export function AppShell({
  contexte,
  organisations,
  workspaces,
  utilisateurNom,
  utilisateurEmail,
  notifications,
  children,
}: {
  contexte: ContexteApplicatif
  organisations: OrganisationSwitcherItem[]
  workspaces: WorkspaceSwitcherItem[]
  utilisateurNom: string | null
  utilisateurEmail: string
  notifications: NotificationApercu[]
  children: React.ReactNode
}) {
  return (
    <AppShellProvider value={contexte}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar
          orgSlug={contexte.orgSlug}
          workspaceSlug={contexte.workspaceSlug}
          organisations={organisations}
          workspaces={workspaces}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            orgSlug={contexte.orgSlug}
            workspaceSlug={contexte.workspaceSlug}
            nom={utilisateurNom}
            email={utilisateurEmail}
            notifications={notifications}
          />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AppShellProvider>
  )
}
