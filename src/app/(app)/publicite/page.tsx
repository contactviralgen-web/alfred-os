import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/layout/page-header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { AgentHighlight } from "@/components/agents/agent-highlight"
import { cn } from "@/lib/utils"
import { demoCampagnes, demoPubliciteResume, type Campagne } from "@/lib/demo/publicite-data"
import { demoRecommendations } from "@/lib/demo/dashboard-data"

const eur = (n: number) => `${n.toLocaleString("fr-FR")} €`

const RECO_LABEL: Record<Campagne["recommandation"], string> = {
  augmenter: "Augmenter",
  maintenir: "Maintenir",
  reduire: "Réduire",
  couper: "Couper",
}

const RECO_CLASS: Record<Campagne["recommandation"], string> = {
  augmenter: "border-positive/40 text-positive bg-positive/10",
  maintenir: "border-border text-muted-foreground",
  reduire: "border-negative/40 text-negative bg-negative/10",
  couper: "border-negative/40 text-negative bg-negative/10",
}

export default function PublicitePage() {
  const highlight = demoRecommendations.find((r) => r.agent === "Agent Publicité")

  return (
    <>
      <PageHeader
        title="Publicité"
        description="Performance Amazon Ads et Meta Ads — Agent Publicité. Où investir ou réduire le budget."
      />

      {highlight && <AgentHighlight item={highlight} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Dépenses publicitaires (30 jours)"
          value={eur(demoPubliciteResume.depensesTotal)}
          trend="up"
          trendLabel="+9,3 % vs mois dernier"
          positiveIsUp={false}
        />
        <KpiCard
          label="ROAS moyen"
          value={`${demoPubliciteResume.roasMoyen.toFixed(1)}x`}
          trend="down"
          trendLabel="-0,4 vs mois dernier"
          positiveIsUp
        />
        <KpiCard
          label="TACOS"
          value={`${(demoPubliciteResume.tacos * 100).toFixed(1)} %`}
          trend="up"
          trendLabel="+0,6 pt vs mois dernier"
          positiveIsUp={false}
        />
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            {demoCampagnes.length} campagnes actives
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campagne</TableHead>
                <TableHead>Plateforme</TableHead>
                <TableHead className="text-right">Dépenses</TableHead>
                <TableHead className="text-right">CA attribué</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">ACOS</TableHead>
                <TableHead className="text-right">Recommandation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoCampagnes.map((c) => (
                <TableRow key={c.nom}>
                  <TableCell className="font-medium">{c.nom}</TableCell>
                  <TableCell className="text-muted-foreground">{c.plateforme}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(c.depenses)}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(c.caAttribue)}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.roas.toFixed(1)}x</TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums font-medium",
                      c.acos <= 30 ? "text-positive" : "text-negative"
                    )}
                  >
                    {c.acos.toFixed(1)} %
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={cn("font-normal", RECO_CLASS[c.recommandation])}>
                      {RECO_LABEL[c.recommandation]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
