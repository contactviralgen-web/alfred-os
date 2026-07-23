import { Sparkles } from "lucide-react"

import type { InsightIA } from "@/modules/agents/services/insights.service"

// Un seul point clé + une action concrète — volontairement condensé (pas de
// pavé de 3 paragraphes) pour rester lisible en démo.
export function AiInsightPanel({ insight }: { insight: InsightIA }) {
  return (
    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.04] p-3.5 text-sm">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>
        <p className="font-semibold">{insight.conclusion}</p>
        <p className="text-muted-foreground">{insight.suggestion}</p>
      </div>
    </div>
  )
}
