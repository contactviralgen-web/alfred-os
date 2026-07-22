import { Sparkles } from "lucide-react"

import type { InsightIA } from "@/modules/agents/services/insights.service"

export function AiInsightPanel({ insight }: { insight: InsightIA }) {
  return (
    <div className="mt-4 space-y-1.5 rounded-xl border border-primary/20 bg-primary/[0.04] p-3.5 text-sm">
      <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-primary uppercase">
        <Sparkles className="size-3.5" />
        Analyse du Directeur IA
      </p>
      <p>
        <span className="font-semibold">Constat — </span>
        {insight.constat}
      </p>
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">Conclusion — </span>
        {insight.conclusion}
      </p>
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">Suggestion — </span>
        {insight.suggestion}
      </p>
    </div>
  )
}
