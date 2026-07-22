"use client"

import { Check, ChevronsUpDown, Layers } from "lucide-react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type WorkspaceSwitcherItem = { slug: string; nom: string }

export function SidebarWorkspaceSwitcher({
  workspaces,
  orgSlug,
  workspaceSlugActif,
}: {
  workspaces: WorkspaceSwitcherItem[]
  orgSlug: string
  workspaceSlugActif: string
}) {
  const actif = workspaces.find((w) => w.slug === workspaceSlugActif)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <Layers className="size-3.5 shrink-0" />
            <span className="flex-1 truncate">{actif?.nom ?? "Workspace"}</span>
            <ChevronsUpDown className="size-3.5 shrink-0" />
          </button>
        }
      />
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.slug}
              render={<Link href={`/${orgSlug}/${ws.slug}/tableau-de-bord`} />}
              className={cn(ws.slug === workspaceSlugActif && "font-medium")}
            >
              <span className="flex-1 truncate">{ws.nom}</span>
              {ws.slug === workspaceSlugActif ? <Check className="size-4" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
