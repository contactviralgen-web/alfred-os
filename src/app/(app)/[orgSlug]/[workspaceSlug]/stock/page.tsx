import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { StockTable } from "@/components/stock/stock-table"
import { StockMovementsList } from "@/components/stock/stock-movements-list"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { listerMouvementsRecents, listerStock } from "@/modules/stock/services/stock.service"

export const metadata: Metadata = { title: "Stock — Pilot" }

export default async function StockPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)

  const [produits, mouvements] = await Promise.all([
    listerStock(workspace.id),
    listerMouvementsRecents(workspace.id),
  ])

  return (
    <>
      <PageHeader
        titre="Stock"
        description="Niveaux et mouvements saisis manuellement en attendant la synchronisation FBA automatique"
      />
      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StockTable produits={produits} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
        </div>
        <StockMovementsList mouvements={mouvements} />
      </div>
    </>
  )
}
