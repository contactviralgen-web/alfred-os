import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { WorkspaceTvaForm } from "@/components/rentabilite/workspace-tva-form"
import { ProductCostsTable } from "@/components/rentabilite/product-costs-table"
import { MarginEvolutionChart } from "@/components/rentabilite/margin-evolution-chart"
import { ProductMarginsTable } from "@/components/rentabilite/product-margins-table"
import { NewProductDialog } from "@/components/rentabilite/new-product-dialog"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import {
  obtenirEvolutionMarge,
  obtenirMargesParCategorie,
  obtenirMargesParProduit,
  obtenirReglagesCoutsProduits,
  obtenirReglagesWorkspace,
} from "@/modules/rentabilite/services/margins.service"
import { genererInsightMarge } from "@/modules/agents/services/insights.service"

export const metadata: Metadata = { title: "Rentabilité — Pilot" }

export default async function RentabilitePage({
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
  const periode6mois = {
    debut: new Date(maintenant.getTime() - 180 * 86400000).toISOString(),
    fin: maintenant.toISOString(),
  }

  const [reglages, coutsProduits, margesParProduit, margesParCategorie, evolutionMarge] =
    await Promise.all([
      obtenirReglagesWorkspace(workspace.id),
      obtenirReglagesCoutsProduits(workspace.id),
      obtenirMargesParProduit(workspace.id, periode30j),
      obtenirMargesParCategorie(workspace.id, periode30j),
      obtenirEvolutionMarge(workspace.id, "mois", periode6mois),
    ])

  return (
    <>
      <PageHeader
        titre="Rentabilité"
        description="Marge nette réelle par produit — combine vos commandes avec la TVA et les charges Amazon/logistique saisies ci-dessous"
      />
      <div className="space-y-6 p-6">
        <WorkspaceTvaForm
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
          tauxTvaPct={reglages.tauxTvaPct}
          prixTtc={reglages.prixTtc}
        />
        <MarginEvolutionChart
          donnees={evolutionMarge}
          insight={genererInsightMarge(margesParProduit)}
        />
        <ProductMarginsTable parProduit={margesParProduit} parCategorie={margesParCategorie} />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Charges par produit{" "}
              <span className="text-muted-foreground">
                — à renseigner manuellement en attendant la connexion Amazon SP-API
              </span>
            </p>
            <NewProductDialog orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
          </div>
          <ProductCostsTable
            produits={coutsProduits}
            orgSlug={orgSlug}
            workspaceSlug={workspaceSlug}
          />
        </div>
      </div>
    </>
  )
}
