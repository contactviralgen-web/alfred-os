import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { StockTable } from "@/components/stock/stock-table"
import { StockMovementsList } from "@/components/stock/stock-movements-list"
import { AnalyserStockButton } from "@/components/stock/analyser-stock-button"
import { RecommendationsList } from "@/components/agents/recommendations-list"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { listerMouvementsRecents, listerStock } from "@/modules/stock/services/stock.service"
import { listerRecommandationsActives } from "@/modules/agents/services/recommendations.service"

export const metadata: Metadata = { title: "Stock — Pilot" }

export default async function StockPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)

  const [produits, mouvements, recommandations] = await Promise.all([
    listerStock(workspace.id),
    listerMouvementsRecents(workspace.id),
    listerRecommandationsActives(workspace.id, "stock"),
  ])

  return (
    <>
      <PageHeader
        titre="Stock"
        description="Niveaux et mouvements saisis manuellement en attendant la synchronisation FBA automatique"
        actions={<AnalyserStockButton orgSlug={orgSlug} workspaceSlug={workspaceSlug} />}
      />
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Recommandations de l&apos;Agent Stock</p>
          <RecommendationsList recommandations={recommandations} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StockTable produits={produits} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
          </div>
          <StockMovementsList mouvements={mouvements} />
        </div>
      </div>
    </>
  )
}
