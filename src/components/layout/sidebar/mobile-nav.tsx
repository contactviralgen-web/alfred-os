"use client"

import { Menu, Settings } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { NAV_GENERAL, REGISTRE_MODULES } from "@/lib/module-registry"
import { Logo } from "@/components/shared/logo"
import { SidebarNavItem } from "@/components/layout/sidebar/sidebar-nav-item"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav({
  orgSlug,
  workspaceSlug,
}: {
  orgSlug: string
  workspaceSlug: string
}) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <Sheet open={ouvert} onOpenChange={setOuvert}>
      <SheetTrigger
        render={
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/60 md:hidden"
          >
            <Menu className="size-4" />
          </button>
        }
      />
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border/60">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-3"
          onClick={() => setOuvert(false)}
        >
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
            <p className="px-2.5 pb-1 text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
              Modules
            </p>
            {REGISTRE_MODULES.flatMap((m) => m.nav).map((item) => (
              <SidebarNavItem
                key={item.segment}
                item={item}
                orgSlug={orgSlug}
                workspaceSlug={workspaceSlug}
              />
            ))}
          </div>
          <Link
            href={`/${orgSlug}/${workspaceSlug}/parametres/organisation`}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          >
            <Settings className="size-4" />
            Paramètres
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
