import { AlertTriangle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Recommendation } from "@/lib/demo/dashboard-data"

export function AgentHighlight({ item }: { item: Recommendation }) {
  const Icon = item.severite === "positive" ? TrendingUp : AlertTriangle

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-start",
        item.severite === "positive"
          ? "border-positive/30 bg-positive/5"
          : "border-negative/30 bg-negative/5"
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          item.severite === "positive" ? "text-positive" : "text-negative"
        )}
      />
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{item.titre}</p>
        <p className="text-sm text-muted-foreground">{item.detail}</p>
      </div>
      <p
        className={cn(
          "text-sm font-medium tabular-nums sm:ml-auto sm:shrink-0",
          item.severite === "positive" ? "text-positive" : "text-negative"
        )}
      >
        {item.impact}
      </p>
    </div>
  )
}
