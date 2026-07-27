import { Badge } from "@/components/ui/badge"
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
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { AgentHighlight } from "@/components/agents/agent-highlight"
import { AgentChatCard } from "@/components/agents/agent-chat-card"
import { AgentProfileCard } from "@/components/agents/agent-profile-card"
import { cn } from "@/lib/utils"
import {
  demoAgentMarketingChat,
  demoCampagnes,
  demoPubliciteResume,
  type Campagne,
} from "@/lib/demo/publicite-data"
import { demoRecommendations } from "@/lib/demo/dashboard-data"
import { demoKeywordPerformance, demoListingOptimization } from "@/lib/demo/seo-data"
import { demoCustomerMessages, demoReviewRequests } from "@/lib/demo/service-client-data"
import { demoComplianceNotifications } from "@/lib/demo/conformite-data"

const eur = (n: number) => `${n.toLocaleString("fr-FR")} €`
const pct = (n: number) => `${(n * 100).toFixed(1)} %`

const RECO_LABEL: Record<Campagne["recommandation"], string> = {
  augmenter: "Augmenter",
  maintenir: "Maintenir",
  reduire: "Réduire",
  couper: "Couper",
}

const RECO_CLASS: Record<Campagne["recommandation"], string> = {
  augmenter: "border-primary/40 text-primary bg-primary/10",
  maintenir: "border-border text-muted-foreground",
  reduire: "border-primary/40 text-primary bg-primary/10",
  couper: "border-transparent bg-primary text-primary-foreground",
}

const REVIEW_STATUT_LABEL = {
  "a-envoyer": "À envoyer",
  envoyee: "Envoyée",
  "non-eligible": "Non éligible",
} as const

const REVIEW_STATUT_CLASS = {
  "a-envoyer": "border-primary/40 text-primary bg-primary/10",
  envoyee: "border-border text-muted-foreground",
  "non-eligible": "border-border text-muted-foreground",
} as const

const GRAVITE_LABEL = {
  info: "Info",
  attention: "À surveiller",
  urgent: "Urgent",
} as const

const GRAVITE_CLASS = {
  info: "border-border text-muted-foreground",
  attention: "border-primary/40 text-primary bg-primary/10",
  urgent: "border-transparent bg-primary text-primary-foreground",
} as const

export default function PublicitePage() {
  const highlight = demoRecommendations.find((r) => r.agent === "Agent Marketing")

  const totalClics = demoKeywordPerformance.reduce((s, k) => s + k.clics, 0)
  const partAchatMoyenne =
    demoKeywordPerformance.reduce((s, k) => s + k.partAchat, 0) / demoKeywordPerformance.length

  const avisAEnvoyer = demoReviewRequests.filter((r) => r.statut === "a-envoyer").length
  const avisEnvoyes = demoReviewRequests.filter((r) => r.statut === "envoyee").length
  const messagesEnAttente = demoCustomerMessages.filter((m) => m.statut === "en-attente").length

  return (
    <>
      <PageHeader
        title="Agent Marketing"
        description="Julien pilote vos campagnes Amazon Ads et Meta Ads — où investir, où couper."
      />

      {highlight && <AgentHighlight item={highlight} />}

      <Tabs defaultValue="campagnes">
        <TabsList>
          <TabsTrigger value="campagnes">Campagnes</TabsTrigger>
          <TabsTrigger value="seo">SEO &amp; Fiches</TabsTrigger>
          <TabsTrigger value="service-client">Service client</TabsTrigger>
          <TabsTrigger value="conformite">Conformité</TabsTrigger>
        </TabsList>

        <TabsContent value="campagnes" className="mt-4 space-y-4">
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
              value={pct(demoPubliciteResume.tacos)}
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
        </TabsContent>

        <TabsContent value="seo" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Mots-clés suivis"
              value={String(demoKeywordPerformance.length)}
              trend="up"
              trendLabel="données propres à vos produits"
              positiveIsUp
            />
            <KpiCard
              label="Clics captés (30 jours)"
              value={totalClics.toLocaleString("fr-FR")}
              trend="up"
              trendLabel="+8,4 % vs mois dernier"
              positiveIsUp
            />
            <KpiCard
              label="Part d'achat moyenne"
              value={pct(partAchatMoyenne)}
              trend="down"
              trendLabel="tirée vers le bas par Gourdes inox"
              positiveIsUp
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance mots-clés</CardTitle>
              <CardDescription>
                Search Query Performance (Amazon Brand Analytics) — volumes, clics et part
                d&apos;achat réels sur vos propres fiches produit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mot-clé</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-right">Volume recherche</TableHead>
                    <TableHead className="text-right">Impressions</TableHead>
                    <TableHead className="text-right">Clics</TableHead>
                    <TableHead className="text-right">Part d&apos;achat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoKeywordPerformance.map((k) => (
                    <TableRow key={k.keyword}>
                      <TableCell className="font-medium">{k.keyword}</TableCell>
                      <TableCell className="text-muted-foreground">{k.produit}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {k.volumeRecherche.toLocaleString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {k.impressions.toLocaleString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {k.clics.toLocaleString("fr-FR")}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-medium tabular-nums",
                          k.tendance === "up" ? "text-positive" : "text-negative"
                        )}
                      >
                        {pct(k.partAchat)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimisation IA de fiche produit</CardTitle>
              <CardDescription>
                {demoListingOptimization.produit} ({demoListingOptimization.asin}) — mots-clés
                ajoutés :{" "}
                {demoListingOptimization.motsClesAjoutes.map((mc) => (
                  <Badge key={mc} variant="outline" className="ml-1 border-primary/40 text-primary font-normal">
                    {mc}
                  </Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Fiche actuelle</p>
                  <p className="text-sm font-medium">{demoListingOptimization.actuel.titre}</p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {demoListingOptimization.actuel.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    {demoListingOptimization.actuel.description}
                  </p>
                </div>
                <div className="space-y-3 rounded-lg border border-primary/40 bg-primary/5 p-4">
                  <p className="text-xs font-medium text-primary uppercase">Suggestion IA</p>
                  <p className="text-sm font-medium">{demoListingOptimization.suggere.titre}</p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {demoListingOptimization.suggere.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    {demoListingOptimization.suggere.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Aperçu de démonstration — l&apos;application sur la fiche Amazon se fera via la
                  Listings Items API une fois le compte connecté.
                </p>
                <Button disabled>Appliquer sur Amazon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service-client" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Avis à demander"
              value={String(avisAEnvoyer)}
              trend="up"
              trendLabel="éligibles maintenant"
              positiveIsUp
            />
            <KpiCard
              label="Messages en attente"
              value={String(messagesEnAttente)}
              trend="down"
              trendLabel="réponse suggérée par l'IA"
              positiveIsUp={false}
            />
            <KpiCard
              label="Avis demandés ce mois"
              value={String(avisEnvoyes)}
              trend="up"
              trendLabel="via Solicitations API"
              positiveIsUp
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Demandes d&apos;avis</CardTitle>
              <CardDescription>
                Commandes éligibles à la demande officielle d&apos;avis Amazon (5 à 30 jours après
                livraison).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Date commande</TableHead>
                    <TableHead>Éligible jusqu&apos;au</TableHead>
                    <TableHead className="text-right">Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoReviewRequests.map((r) => (
                    <TableRow key={r.commandeId}>
                      <TableCell className="font-medium">{r.commandeId}</TableCell>
                      <TableCell className="text-muted-foreground">{r.produit}</TableCell>
                      <TableCell className="text-muted-foreground">{r.dateCommande}</TableCell>
                      <TableCell className="text-muted-foreground">{r.eligibleJusqua}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={cn("font-normal", REVIEW_STATUT_CLASS[r.statut])}>
                          {REVIEW_STATUT_LABEL[r.statut]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" disabled={r.statut !== "a-envoyer"}>
                          Demander l&apos;avis
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Messages acheteurs</CardTitle>
              <CardDescription>
                Réponses suggérées par l&apos;IA — limitées aux catégories de messages autorisées
                par Amazon (Messaging API), pas de contenu libre.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoCustomerMessages.map((m) => (
                <div key={m.commandeId} className="space-y-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-border font-normal text-muted-foreground">
                        {m.categorie}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{m.commandeId}</span>
                    </div>
                    <Button size="sm" variant="outline" disabled={m.statut === "envoyee"}>
                      {m.statut === "envoyee" ? "Envoyée" : "Envoyer la réponse"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">« {m.question} »</p>
                  <p className="rounded-lg bg-secondary px-3 py-2 text-sm">{m.reponseSuggeree}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conformite" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Veille conformité &amp; politique Amazon</CardTitle>
              <CardDescription>
                Notifications de statut de compte et de politique (SP-API Notifications),
                résumées en clair par l&apos;IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoComplianceNotifications.map((n, i) => (
                <div key={i} className="space-y-1.5 border-t border-border pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("font-normal", GRAVITE_CLASS[n.gravite])}>
                        {GRAVITE_LABEL[n.gravite]}
                      </Badge>
                      <span className="text-sm font-medium">{n.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{n.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.resumeIA}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgentChatCard
            avatarSrc="/agents/marketing.png"
            name="Julien"
            role="Agent Marketing"
            initialMessages={demoAgentMarketingChat}
          />
        </div>
        <AgentProfileCard
          avatarSrc="/agents/marketing.png"
          name="Julien"
          role="Agent Marketing"
          tagline="Optimise vos campagnes Amazon Ads et Meta Ads en continu."
        />
      </div>
    </>
  )
}
