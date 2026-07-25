import { Badge } from "@/components/ui/badge"

export function PageHeader({
  title,
  description,
  status,
}: {
  title: string
  description?: string
  status?: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-[28px] font-semibold tracking-tight">{title}</h1>
        {status && (
          <Badge variant="outline" className="border-positive/40 text-positive font-normal">
            {status}
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
