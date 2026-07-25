import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Recommendation } from "@/lib/demo/dashboard-data"

export function RecommendationsList({ items }: { items: Recommendation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Décisions prioritaires</CardTitle>
        <CardDescription>Synthèse des agents Profit, Publicité et Stock.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item) => (
          <div
            key={item.titre}
            className="flex items-start justify-between gap-4 border-t border-border py-4 first:border-t-0 first:pt-0"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    item.severite === "positive" ? "bg-positive" : "bg-negative"
                  )}
                />
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                  {item.agent}
                </Badge>
              </div>
              <p className="text-sm font-medium">{item.titre}</p>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </div>
            <p
              className={cn(
                "shrink-0 text-sm font-medium tabular-nums",
                item.severite === "positive" ? "text-positive" : "text-negative"
              )}
            >
              {item.impact}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
