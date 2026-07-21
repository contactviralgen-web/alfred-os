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
      <Icone className="size-4 shrink-0" />
      <span className="flex-1 truncate">{item.titre}</span>
      {item.bientotDisponible ? (
        <span className="text-[11px] text-muted-foreground/60">Bientôt</span>
      ) : null}
    </>
  )

  const classesCommunes = cn(
    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
    actif
      ? "bg-accent text-foreground"
      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
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
