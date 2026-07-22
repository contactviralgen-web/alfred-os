"use client"

import { Check, ChevronsUpDown } from "lucide-react"
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

export type OrganisationSwitcherItem = { slug: string; nom: string }

export function SidebarOrgSwitcher({
  organisations,
  orgSlugActif,
}: {
  organisations: OrganisationSwitcherItem[]
  orgSlugActif: string
}) {
  const active = organisations.find((o) => o.slug === orgSlugActif)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-sidebar-foreground hover:bg-sidebar-accent/60"
          >
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-blue-700 text-[11px] font-semibold text-white shadow-[0_0_12px_-2px_var(--primary)]">
              {active?.nom.slice(0, 1).toUpperCase() ?? "?"}
            </span>
            <span className="flex-1 truncate font-medium">{active?.nom ?? "Organisation"}</span>
            <ChevronsUpDown className="size-3.5 text-sidebar-foreground/50" />
          </button>
        }
      />
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organisations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organisations.map((org) => (
            <DropdownMenuItem
              key={org.slug}
              render={<Link href={`/${org.slug}`} />}
              className={cn(org.slug === orgSlugActif && "font-medium")}
            >
              <span className="flex-1 truncate">{org.nom}</span>
              {org.slug === orgSlugActif ? <Check className="size-4" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
