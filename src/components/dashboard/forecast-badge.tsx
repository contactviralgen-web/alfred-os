import { Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function ForecastBadge() {
  return (
    <Badge
      variant="outline"
      className="gap-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
    >
      <Sparkles className="size-3" />
      Prévision IA (bêta)
    </Badge>
  )
}
