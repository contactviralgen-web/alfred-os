import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { AmazonKpis } from "@/components/amazon/amazon-kpis"
import { AmazonConnectionCard } from "@/components/amazon/amazon-connection-card"
import { AmazonProductsTable } from "@/components/amazon/amazon-products-table"
import { ReturnsPanel } from "@/components/amazon/returns-panel"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import {
  obtenirConnexion,
  obtenirIndicateursCompte,
  obtenirMotifsFrequents,
  obtenirVentesAmazon,
  listerRetours,
} from "@/modules/amazon/services/amazon.service"
import { listerStock } from "@/modules/stock/services/stock.service"
import { listerProduitsSimple } from "@/modules/rentabilite/services/products.service"

export const metadata: Metadata = { title: "Amazon — Pilot" }

export default async function AmazonPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)

  const maintenant = new Date()
  const periode30j = {
    debut: new Date(maintenant.getTime() - 30 * 86400000).toISOString(),
    fin: maintenant.toISOString(),
  }

  const [connexion, indicateurs, ventes, produitsStock, produitsSimples, retours, motifsFrequents] =
    await Promise.all([
      obtenirConnexion(workspace.id),
      obtenirIndicateursCompte(workspace.id),
      obtenirVentesAmazon(workspace.id, periode30j),
      listerStock(workspace.id),
      listerProduitsSimple(workspace.id),
      listerRetours(workspace.id),
      obtenirMotifsFrequents(workspace.id),
    ])

  return (
    <>
      <PageHeader
        titre="Amazon"
        description="Ventes, frais et retours du canal Amazon — connexion SP-API simulée pour la démo"
      />
      <div className="space-y-6 p-6">
        <AmazonConnectionCard connexion={connexion} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />

        {connexion.statut === "connecte" ? (
          <>
            <AmazonKpis
              ca={ventes.ca}
              benefice={ventes.benefice}
              commandes={ventes.commandes}
              scoreSante={indicateurs.scoreSante}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium">Produits synchronisés</p>
              <AmazonProductsTable produits={produitsStock} />
            </div>

            <ReturnsPanel
              retours={retours}
              motifsFrequents={motifsFrequents}
              produitsInitiaux={produitsSimples}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
            />
          </>
        ) : null}
      </div>
    </>
  )
}
