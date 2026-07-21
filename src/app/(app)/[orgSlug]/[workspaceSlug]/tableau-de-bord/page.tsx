import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { DashboardKpis } from "@/components/dashboard/dashboard-kpis"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown"
import { TopProductsTable } from "@/components/dashboard/top-products-table"
import { StockAlertsList } from "@/components/dashboard/stock-alerts-list"
import { BlockedOrdersList } from "@/components/dashboard/blocked-orders-list"
import { TasksWidget } from "@/components/dashboard/tasks-widget"
import { MiniCalendarWidget } from "@/components/dashboard/mini-calendar-widget"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import {
  obtenirCourbeCA,
  obtenirRepartitionCanaux,
  obtenirResumeKpis,
} from "@/modules/dashboard/services/revenue-metrics.service"
import {
  obtenirCommandesBloquees,
  obtenirTopProduits,
} from "@/modules/dashboard/services/orders-metrics.service"
import { obtenirAlertesStock } from "@/modules/dashboard/services/stock-alerts.service"
import {
  listerProchainsEvenements,
  listerTachesUtilisateur,
} from "@/modules/dashboard/services/productivity.service"

export const metadata: Metadata = { title: "Tableau de bord — Alfred OS" }

export default async function TableauDeBordPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)

  const [
    kpis,
    courbeCa,
    repartitionCanaux,
    topProduits,
    alertesStock,
    commandesBloquees,
    taches,
    evenements,
  ] = await Promise.all([
    obtenirResumeKpis(workspace.id),
    obtenirCourbeCA(workspace.id),
    obtenirRepartitionCanaux(workspace.id),
    obtenirTopProduits(workspace.id),
    obtenirAlertesStock(workspace.id),
    obtenirCommandesBloquees(workspace.id),
    listerTachesUtilisateur(workspace.id),
    listerProchainsEvenements(workspace.id),
  ])

  return (
    <>
      <PageHeader
        titre="Tableau de bord"
        description={`Vue d'ensemble de ${organisation.nom} — ${workspace.nom}`}
      />
      <div className="space-y-6 p-6">
        <DashboardKpis
          ca30j={kpis?.ca30j ?? 0}
          benefice30j={kpis?.benefice30j ?? 0}
          margePct={kpis?.margePct ?? 0}
          commandes30j={kpis?.commandes30j ?? 0}
          croissancePct={kpis?.croissancePct}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart donnees={courbeCa} />
          </div>
          <ChannelBreakdown donnees={repartitionCanaux} />
        </div>

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
