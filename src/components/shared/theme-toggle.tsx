"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { useEstMonte } from "@/hooks/use-mounted"

export function ThemeToggleButton({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const monte = useEstMonte()

  const sombre = monte && resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label="Changer le thème"
      onClick={() => setTheme(sombre ? "light" : "dark")}
      className={cn(
        "flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        className
      )}
    >
      {sombre ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

export function ThemeToggleSetting() {
  const { resolvedTheme, setTheme } = useTheme()
  const monte = useEstMonte()

  const sombre = monte && resolvedTheme === "dark"

  return (
    <div className="flex max-w-lg flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 p-4">
      <div className="flex min-w-0 flex-col">
        <p className="text-sm font-medium">Mode sombre</p>
        <p className="text-sm text-muted-foreground">
          Basculer entre l&apos;apparence claire et sombre de l&apos;interface.
        </p>
      </div>
      <div className="flex shrink-0 overflow-hidden rounded-lg border border-border/60">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-sm whitespace-nowrap",
            !sombre ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent/60"
          )}
        >
          <Sun className="size-3.5" />
          Clair
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-sm whitespace-nowrap",
            sombre ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent/60"
          )}
        >
          <Moon className="size-3.5" />
          Sombre
        </button>
      </div>
    </div>
  )
}
