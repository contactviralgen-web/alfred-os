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
import { AgentChatCard } from "@/components/agents/agent-chat-card"
import { AgentProfileCard } from "@/components/agents/agent-profile-card"
import { cn } from "@/lib/utils"
import {
  demoAgentFinancierChat,
  demoRentabiliteProduits,
  demoRentabiliteResume,
} from "@/lib/demo/rentabilite-data"
import { demoRecommendations } from "@/lib/demo/dashboard-data"

const eur = (n: number) => `${n.toLocaleString("fr-FR")} €`

export default function RentabilitePage() {
  const highlight = demoRecommendations.find((r) => r.agent === "Agent Financier")

  return (
    <>
      <PageHeader
        title="Agent Financier"
        description="Marc analyse votre rentabilité réelle produit par produit — revenue - coût produit - frais plateforme - publicité - logistique - retours."
      />

      {highlight && <AgentHighlight item={highlight} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Chiffre d'affaires (30 jours)"
          value={eur(demoRentabiliteResume.caTotal)}
          trend="up"
          trendLabel="+6,1 % vs mois dernier"
          positiveIsUp
        />
        <KpiCard
          label="Profit réel (30 jours)"
          value={eur(demoRentabiliteResume.profitTotal)}
          trend="up"
          trendLabel="+12,4 % vs mois dernier"
          positiveIsUp
        />
        <KpiCard
          label="Marge nette moyenne"
          value={`${(demoRentabiliteResume.margeMoyenne * 100).toFixed(1)} %`}
          trend="down"
          trendLabel="-1,1 pt vs mois dernier"
          positiveIsUp={false}
        />
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            {demoRentabiliteProduits.length} produits actifs
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">CA</TableHead>
                <TableHead className="text-right">Coût produit</TableHead>
                <TableHead className="text-right">Frais plateforme</TableHead>
                <TableHead className="text-right">Publicité</TableHead>
                <TableHead className="text-right">Logistique</TableHead>
                <TableHead className="text-right">Retours</TableHead>
                <TableHead className="text-right">Profit réel</TableHead>
                <TableHead className="text-right">Marge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoRentabiliteProduits.map((p) => {
                const margePct = (p.margeNette / p.ca) * 100
                const bonneMagre = margePct >= 20
                return (
                  <TableRow key={p.asin}>
                    <TableCell>
                      <p className="font-medium">{p.nom}</p>
                      <p className="text-xs text-muted-foreground">{p.asin}</p>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{eur(p.ca)}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      -{eur(p.coutProduit)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      -{eur(p.fraisPlateforme)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      -{eur(p.depensesPub)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      -{eur(p.logistique)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      -{eur(p.retours)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium tabular-nums",
                        p.margeNette >= 0 ? "text-positive" : "text-negative"
                      )}
                    >
                      {eur(p.margeNette)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium tabular-nums",
                        bonneMagre ? "text-positive" : "text-negative"
                      )}
                    >
                      {margePct.toFixed(1)} %
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgentChatCard
            avatarSrc="/agents/financier.png"
            name="Marc"
            role="Agent Financier"
            initialMessages={demoAgentFinancierChat}
          />
        </div>
        <AgentProfileCard
          avatarSrc="/agents/financier.png"
          name="Marc"
          role="Agent Financier"
          tagline="Analyse votre rentabilité produit par produit, 24h/24."
        />
      </div>
    </>
  )
}
