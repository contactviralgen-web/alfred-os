import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { DEFAULT_FLOOR_MARGIN_PCT, demoPriceRecommendations } from "@/lib/demo/repricer-data"
import { getSettingsData } from "@/lib/organizations/profile"

const eur = (n: number) => `${n.toLocaleString("fr-FR")} €`

export default async function RentabilitePage() {
  const highlight = demoRecommendations.find((r) => r.agent === "Agent Financier")
  const { organization } = await getSettingsData()
  const floorMarginPct = organization?.targetMarginPct ?? DEFAULT_FLOOR_MARGIN_PCT

  const bloques = demoPriceRecommendations.filter((r) => r.margeProjetee * 100 < floorMarginPct)

  return (
    <>
      <PageHeader
        title="Agent Financier"
        description="Marc analyse votre rentabilité réelle produit par produit — revenue - coût produit - frais plateforme - publicité - logistique - retours."
      />

      {highlight && <AgentHighlight item={highlight} />}

      <Tabs defaultValue="rentabilite">
        <TabsList>
          <TabsTrigger value="rentabilite">Rentabilité</TabsTrigger>
          <TabsTrigger value="repricer">Repricer</TabsTrigger>
        </TabsList>

        <TabsContent value="rentabilite" className="mt-4 space-y-4">
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
        </TabsContent>

        <TabsContent value="repricer" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Produits sous surveillance"
              value={String(demoPriceRecommendations.length)}
              trend="up"
              trendLabel="repricing Buy Box"
              positiveIsUp
            />
            <KpiCard
              label="Ajustements bloqués"
              value={String(bloques.length)}
              trend={bloques.length > 0 ? "up" : "down"}
              trendLabel="marge insuffisante"
              positiveIsUp={false}
            />
            <KpiCard
              label="Marge plancher configurée"
              value={`${floorMarginPct.toFixed(1)} %`}
              trend="up"
              trendLabel="définie dans Paramètres"
              positiveIsUp
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Repricer automatique</CardTitle>
              <CardDescription>
                Avant tout ajustement de prix pour reprendre la Buy Box, Marc vérifie que la marge
                nette réelle projetée reste au-dessus de votre marge plancher (
                {floorMarginPct.toFixed(1)} % —{" "}
                <Link href="/parametres" className="text-primary underline-offset-4 hover:underline">
                  modifiable dans Paramètres
                </Link>
                ). Si l&apos;ajustement ferait passer la marge en dessous, il est bloqué
                automatiquement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-right">Prix actuel</TableHead>
                    <TableHead className="text-right">Prix concurrent (Buy Box)</TableHead>
                    <TableHead className="text-right">Nouveau prix proposé</TableHead>
                    <TableHead className="text-right">Marge projetée</TableHead>
                    <TableHead className="text-right">Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoPriceRecommendations.map((r) => {
                    const bloque = r.margeProjetee * 100 < floorMarginPct
                    return (
                      <TableRow key={r.asin}>
                        <TableCell>
                          <p className="font-medium">{r.produit}</p>
                          <p className="text-xs text-muted-foreground">{r.asin}</p>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{eur(r.prixActuel)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {eur(r.prixConcurrent)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {eur(r.prixPropose)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium tabular-nums",
                            bloque ? "text-negative" : "text-positive"
                          )}
                        >
                          {(r.margeProjetee * 100).toFixed(1)} %
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-normal",
                              bloque
                                ? "border-transparent bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground"
                            )}
                          >
                            {bloque ? "Bloqué — marge insuffisante" : "Ajustement validé"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" disabled={bloque}>
                            Appliquer
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
