"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import type { ElementNavigation } from "@/lib/module-registry"

export function SidebarNavItem({
  item,
  orgSlug,
  workspaceSlug,
}: {
  item: ElementNavigation
  orgSlug: string
  workspaceSlug: string
}) {
  const pathname = usePathname()
  const href = `/${orgSlug}/${workspaceSlug}/${item.segment}`
  const actif = pathname === href || pathname.startsWith(`${href}/`)
  const Icone = item.icone

  const contenu = (
    <>
      <Icone className={cn("size-4 shrink-0", actif && "text-sidebar-primary")} />
      <span className="flex-1 truncate">{item.titre}</span>
      {item.bientotDisponible ? (
        <span className="text-[11px] text-sidebar-foreground/40">Bientôt</span>
      ) : null}
    </>
  )

  const classesCommunes = cn(
    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
    actif
      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
  )

  if (item.bientotDisponible) {
    return (
      <div className={cn(classesCommunes, "cursor-not-allowed opacity-60")} aria-disabled>
        {contenu}
      </div>
    )
  }

  return (
    <Link href={href} className={classesCommunes}>
      {contenu}
    </Link>
  )
}
