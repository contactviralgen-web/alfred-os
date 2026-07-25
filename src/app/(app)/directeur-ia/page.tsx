import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { ChatPanel } from "@/components/directeur-ia/chat-panel"
import { demoRapportHebdo, demoChatMessages } from "@/lib/demo/directeur-ia-data"

export default function DirecteurIaPage() {
  return (
    <>
      <PageHeader
        title="Directeur IA"
        description="Synthèse hebdomadaire et questions libres sur votre business — Agent Exécutif."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rapport de la semaine</CardTitle>
            <CardDescription>{demoRapportHebdo.semaine} — {demoRapportHebdo.sante}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="size-4 text-negative" />
                <p className="text-sm font-medium">Top 3 problèmes</p>
              </div>
              <ul className="space-y-2">
                {demoRapportHebdo.topProblemes.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="size-4 text-positive" />
                <p className="text-sm font-medium">Top 3 opportunités</p>
              </div>
              <ul className="space-y-2">
                {demoRapportHebdo.topOpportunites.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Poser une question
            </CardTitle>
            <CardDescription>Réponses basées uniquement sur vos données internes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ChatPanel initialMessages={demoChatMessages} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
