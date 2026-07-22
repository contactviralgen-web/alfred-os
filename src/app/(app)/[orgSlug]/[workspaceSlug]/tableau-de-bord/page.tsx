import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { DashboardControls } from "@/components/dashboard/dashboard-controls"
import { DashboardKpis } from "@/components/dashboard/dashboard-kpis"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { DecisionCenter } from "@/components/dashboard/decision-center"
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown"
import { TopProductsTable } from "@/components/dashboard/top-products-table"
import { StockAlertsList } from "@/components/dashboard/stock-alerts-list"
import { BlockedOrdersList } from "@/components/dashboard/blocked-orders-list"
import { TasksWidget } from "@/components/dashboard/tasks-widget"
import { MiniCalendarWidget } from "@/components/dashboard/mini-calendar-widget"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import {
  obtenirRepartitionCanaux,
  obtenirResumeKpis,
} from "@/modules/dashboard/services/revenue-metrics.service"
import {
  obtenirPointsGraphique,
  plageDatesPeriode,
  type MetriqueGraphique,
  type PeriodeGraphique,
} from "@/modules/dashboard/services/revenue-chart.service"
import {
  obtenirCommandesBloquees,
  obtenirTopProduits,
} from "@/modules/dashboard/services/orders-metrics.service"
import { obtenirAlertesStock } from "@/modules/dashboard/services/stock-alerts.service"
import {
  listerProchainsEvenements,
  listerTachesUtilisateur,
} from "@/modules/dashboard/services/productivity.service"
import { obtenirMargesParProduit } from "@/modules/rentabilite/services/margins.service"
import { listerFournisseurs } from "@/modules/fournisseurs/services/suppliers.service"
import { construireCentreDecisions, genererInsightRevenu } from "@/modules/agents/services/insights.service"

export const metadata: Metadata = { title: "Tableau de bord — Pilot" }

const PERIODES_VALIDES: PeriodeGraphique[] = ["24h", "7j", "mois", "annee"]
const METRIQUES_VALIDES: MetriqueGraphique[] = ["ca", "benefice"]

export default async function TableauDeBordPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
  searchParams: Promise<{ periode?: string; metrique?: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const query = await searchParams
  const periode = PERIODES_VALIDES.includes(query.periode as PeriodeGraphique)
    ? (query.periode as PeriodeGraphique)
    : "mois"
  const metrique = METRIQUES_VALIDES.includes(query.metrique as MetriqueGraphique)
    ? (query.metrique as MetriqueGraphique)
    : "ca"

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)
  const { debut, fin } = plageDatesPeriode(periode)

  const [
    kpis,
    pointsGraphique,
    repartitionCanaux,
    topProduits,
    alertesStock,
    commandesBloquees,
    taches,
    evenements,
    margesParProduit,
    fournisseurs,
  ] = await Promise.all([
    obtenirResumeKpis(workspace.id, periode),
    obtenirPointsGraphique(workspace.id, periode, metrique),
    obtenirRepartitionCanaux(workspace.id, periode),
    obtenirTopProduits(workspace.id),
    obtenirAlertesStock(workspace.id),
    obtenirCommandesBloquees(workspace.id),
    listerTachesUtilisateur(workspace.id),
    listerProchainsEvenements(workspace.id),
    obtenirMargesParProduit(workspace.id, { debut, fin }),
    listerFournisseurs(workspace.id),
  ])

  const produitsMargeNegative = margesParProduit.filter((p) => p.margeNette < 0)
  const meilleurProduit = margesParProduit[0] ?? null
  const meilleurFournisseur = fournisseurs.find((f) => f.estRecommande) ?? null
  const tachesPrioritaires = taches.filter((t) => t.priorite === "haute" && t.statut !== "terminee")

  const centreDecisions = construireCentreDecisions({
    alertesStock,
    commandesBloquees,
    produitsMargeNegative,
    meilleurProduit,
    meilleurFournisseur,
    tachesPrioritaires,
  })

  return (
    <>
      <PageHeader
        titre="Tableau de bord"
        description={`Vue d'ensemble de ${organisation.nom} — ${workspace.nom}`}
        actions={<DashboardControls periode={periode} metrique={metrique} />}
      />
      <div className="space-y-6 p-6">
        <DashboardKpis
          periode={periode}
          ca={kpis?.ca ?? 0}
          benefice={kpis?.benefice ?? 0}
          margePct={kpis?.margePct ?? 0}
          commandes={kpis?.commandes ?? 0}
          croissancePct={kpis?.croissancePct}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart
              donnees={pointsGraphique}
              periode={periode}
              metrique={metrique}
              insight={genererInsightRevenu(pointsGraphique, metrique)}
            />
          </div>
          <ChannelBreakdown donnees={repartitionCanaux} />
        </div>

        <DecisionCenter
          problemes={centreDecisions.problemes}
          opportunites={centreDecisions.opportunites}
          actions={centreDecisions.actions}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TopProductsTable produits={topProduits} />
          <StockAlertsList alertes={alertesStock} />
          <BlockedOrdersList commandes={commandesBloquees} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TasksWidget taches={taches} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
          <MiniCalendarWidget evenements={evenements} />
        </div>
      </div>
    </>
  )
}
