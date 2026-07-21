export function PageHeader({
  titre,
  description,
  actions,
}: {
  titre: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{titre}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  )
}
