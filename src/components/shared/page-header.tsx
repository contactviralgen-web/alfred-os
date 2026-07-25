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
    <div className="flex items-start justify-between gap-4 px-6 pt-8 pb-6">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-balance">{titre}</h1>
        {description ? (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  )
}
