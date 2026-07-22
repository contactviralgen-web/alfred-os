import { Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function ForecastBadge() {
  return (
    <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/10 text-primary">
      <Sparkles className="size-3" />
      Prévision IA (bêta)
    </Badge>
  )
}
