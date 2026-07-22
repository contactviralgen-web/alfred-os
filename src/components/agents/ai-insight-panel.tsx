import { Sparkles } from "lucide-react"

import type { InsightIA } from "@/modules/agents/services/insights.service"

export function AiInsightPanel({ insight }: { insight: InsightIA }) {
  return (
    <div className="mt-4 space-y-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-sm">
      <p className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
        <Sparkles className="size-3.5" />
        Analyse du Directeur IA
      </p>
      <p>
        <span className="font-medium">Constat — </span>
        {insight.constat}
      </p>
      <p className="text-muted-foreground">
        <span className="font-medium text-foreground">Conclusion — </span>
        {insight.conclusion}
      </p>
      <p className="text-muted-foreground">
        <span className="font-medium text-foreground">Suggestion — </span>
        {insight.suggestion}
      </p>
    </div>
  )
}
