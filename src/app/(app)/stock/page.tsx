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
import { AgentChatCard } from "@/components/agents/agent-chat-card"
import { AgentProfileCard } from "@/components/agents/agent-profile-card"
import { cn } from "@/lib/utils"
import {
  demoAgentLogistiqueChat,
  demoStockAvecCouverture,
  demoStockResume,
  type StockProduit,
} from "@/lib/demo/stock-data"
import { demoRecommendations } from "@/lib/demo/dashboard-data"

const STATUT_LABEL: Record<StockProduit["statut"], string> = {
  ok: "OK",
  "a-commander": "À commander",
  "rupture-imminente": "Rupture imminente",
}

const STATUT_CLASS: Record<StockProduit["statut"], string> = {
  ok: "border-border text-muted-foreground",
  "a-commander": "border-primary/40 text-primary bg-primary/10",
  "rupture-imminente": "border-transparent bg-primary text-primary-foreground",
}

export default function StockPage() {
  const highlight = demoRecommendations.find((r) => r.agent === "Agent Logistique")

  return (
    <>
      <PageHeader
        title="Agent Logistique"
        description="Léa surveille vos stocks et vos délais fournisseurs pour anticiper toute rupture."
      />

      {highlight && <AgentHighlight item={highlight} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Produits à surveiller"
          value={`${demoStockResume.aRisque} / ${demoStockResume.total}`}
          trend={demoStockResume.aRisque > 0 ? "up" : "down"}
          trendLabel={
            demoStockResume.aRisque > 0
              ? "nécessitent une action"
              : "tout est sous contrôle"
          }
          positiveIsUp={false}
        />
        <KpiCard
          label="Rupture la plus proche"
          value={`${demoStockResume.ruptureLaPlusProche} j`}
          trend="down"
          trendLabel="avant rupture de stock"
          positiveIsUp={false}
        />
        <KpiCard
          label="Couverture moyenne"
          value={`${demoStockResume.couvertureMoyenne} j`}
          trend="up"
          trendLabel="tous produits confondus"
          positiveIsUp
        />
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            {demoStockAvecCouverture.length} produits actifs
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">Stock actuel</TableHead>
                <TableHead className="text-right">Ventes / jour</TableHead>
                <TableHead className="text-right">Jours de couverture</TableHead>
                <TableHead className="text-right">Délai fournisseur</TableHead>
                <TableHead className="text-right">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoStockAvecCouverture.map((p) => (
                <TableRow key={p.nom}>
                  <TableCell className="font-medium">{p.nom}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.stockActuel}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {p.ventesJour}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums font-medium",
                      p.joursDeCouverture <= p.delaiFournisseurJours
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  >
                    {p.joursDeCouverture} j
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {p.delaiFournisseurJours} j
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={cn("font-normal", STATUT_CLASS[p.statut])}>
                      {STATUT_LABEL[p.statut]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgentChatCard
            avatarSrc="/agents/logistique.png"
            name="Léa"
            role="Agent Logistique"
            initialMessages={demoAgentLogistiqueChat}
          />
        </div>
        <AgentProfileCard
          avatarSrc="/agents/logistique.png"
          name="Léa"
          role="Agent Logistique"
          tagline="Surveille vos stocks et anticipe les ruptures avant qu'elles n'arrivent."
        />
      </div>
    </>
  )
}
