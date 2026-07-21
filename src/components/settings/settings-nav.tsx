"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const ONGLETS = [
  { titre: "Organisation", segment: "organisation" },
  { titre: "Membres", segment: "membres" },
  { titre: "Équipes", segment: "equipes" },
  { titre: "Rôles & permissions", segment: "roles-permissions" },
  { titre: "Workspaces", segment: "workspaces" },
  { titre: "Profil", segment: "profil" },
]

export function SettingsNav({
  orgSlug,
  workspaceSlug,
}: {
  orgSlug: string
  workspaceSlug: string
}) {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border/60 px-6">
      {ONGLETS.map((onglet) => {
        const href = `/${orgSlug}/${workspaceSlug}/parametres/${onglet.segment}`
        const actif = pathname === href
        return (
          <Link
            key={onglet.segment}
            href={href}
            className={cn(
              "shrink-0 border-b-2 px-1 py-3 text-sm transition-colors",
              actif
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {onglet.titre}
          </Link>
        )
      })}
    </nav>
  )
}
