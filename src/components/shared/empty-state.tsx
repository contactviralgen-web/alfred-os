import type { LucideIcon } from "lucide-react"

export function EmptyState({
  titre,
  description,
  icone: Icone,
  action,
}: {
  titre: string
  description?: string
  icone?: LucideIcon
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 px-6 py-12 text-center">
      {Icone ? (
        <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icone className="size-5" />
        </span>
      ) : null}
      <div>
        <p className="text-sm font-medium">{titre}</p>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
