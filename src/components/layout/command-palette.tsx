"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Gauge, Search, Settings } from "lucide-react"

import { NAV_GENERAL, REGISTRE_MODULES } from "@/lib/module-registry"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function CommandPalette({
  orgSlug,
  workspaceSlug,
}: {
  orgSlug: string
  workspaceSlug: string
}) {
  const [ouvert, setOuvert] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOuvert((valeur) => !valeur)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function aller(segment: string) {
    setOuvert(false)
    router.push(`/${orgSlug}/${workspaceSlug}/${segment}`)
  }

  const elementsModules = REGISTRE_MODULES.flatMap((m) => m.nav).filter(
    (item) => !item.bientotDisponible
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="flex w-full max-w-xs items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Rechercher...</span>
        <kbd className="rounded border border-border/60 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
      <CommandDialog
        open={ouvert}
        onOpenChange={setOuvert}
        title="Recherche rapide"
        description="Naviguer dans Pilot"
      >
      <CommandInput placeholder="Rechercher une page, une action..." />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {[...NAV_GENERAL.filter((i) => !i.bientotDisponible), ...elementsModules].map(
            (item) => (
              <CommandItem key={item.segment} onSelect={() => aller(item.segment)}>
                <item.icone className="size-4" />
                {item.titre}
              </CommandItem>
            )
          )}
        </CommandGroup>
        <CommandGroup heading="Paramètres">
          <CommandItem onSelect={() => aller("parametres/organisation")}>
            <Settings className="size-4" />
            Organisation
          </CommandItem>
          <CommandItem onSelect={() => aller("parametres/membres")}>
            <Gauge className="size-4" />
            Membres
          </CommandItem>
        </CommandGroup>
      </CommandList>
      </CommandDialog>
    </>
  )
}
