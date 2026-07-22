"use client"

import { Settings } from "lucide-react"
import Link from "next/link"

import { NAV_GENERAL, REGISTRE_MODULES } from "@/lib/module-registry"
import { SidebarNavItem } from "@/components/layout/sidebar/sidebar-nav-item"
import {
  SidebarOrgSwitcher,
  type OrganisationSwitcherItem,
} from "@/components/layout/sidebar/sidebar-org-switcher"
import {
  SidebarWorkspaceSwitcher,
  type WorkspaceSwitcherItem,
} from "@/components/layout/sidebar/sidebar-workspace-switcher"

export function Sidebar({
  orgSlug,
  workspaceSlug,
  organisations,
  workspaces,
}: {
  orgSlug: string
  workspaceSlug: string
  organisations: OrganisationSwitcherItem[]
  workspaces: WorkspaceSwitcherItem[]
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex flex-col gap-1 border-b border-sidebar-border p-3">
        <SidebarOrgSwitcher organisations={organisations} orgSlugActif={orgSlug} />
        <SidebarWorkspaceSwitcher
          workspaces={workspaces}
          orgSlug={orgSlug}
          workspaceSlugActif={workspaceSlug}
        />
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
        <div className="flex flex-col gap-0.5">
          {NAV_GENERAL.map((item) => (
            <SidebarNavItem
              key={item.segment}
              item={item}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="px-2.5 pb-1 text-xs font-semibold tracking-wide text-sidebar-foreground/45 uppercase">
            Modules
          </p>
          {REGISTRE_MODULES.flatMap((module) => module.nav).map((item) => (
            <SidebarNavItem
              key={item.segment}
              item={item}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href={`/${orgSlug}/${workspaceSlug}/parametres/organisation`}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="size-4" />
          Paramètres
        </Link>
      </div>
    </aside>
  )
}
