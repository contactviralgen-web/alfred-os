import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { AdsConnectionCards } from "@/components/ads/ads-connection-cards"
import { AdsKpis } from "@/components/ads/ads-kpis"
import { CampaignsTable } from "@/components/ads/campaigns-table"
import { AnalyserCampagnesButton } from "@/components/ads/analyser-campagnes-button"
import { RecommendationsList } from "@/components/agents/recommendations-list"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { obtenirConnexionsPub, obtenirKpisPub, listerCampagnes } from "@/modules/ads/services/ads.service"
import { listerRecommandationsActives } from "@/modules/agents/services/recommendations.service"

export const metadata: Metadata = { title: "Publicité — Pilot" }

export default async function PublicitePage({
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

  const [connexions, kpis, campagnes, recommandations] = await Promise.all([
    obtenirConnexionsPub(workspace.id),
    obtenirKpisPub(workspace.id, periode30j),
    listerCampagnes(workspace.id),
    listerRecommandationsActives(workspace.id, "publicite"),
  ])

  const auMoinsUneConnexion = connexions.some((c) => c.statut === "connecte")

  return (
    <>
      <PageHeader
        titre="Publicité"
        description="Amazon Ads et Meta Ads — connexions simulées pour la démo"
        actions={
          auMoinsUneConnexion ? (
            <AnalyserCampagnesButton orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
          ) : undefined
        }
      />
      <div className="space-y-6 p-6">
        <AdsConnectionCards connexions={connexions} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />

        {auMoinsUneConnexion ? (
          <>
            <AdsKpis
              depenseTotale={kpis.depenseTotale}
              caGenere={kpis.caGenere}
              roasGlobal={kpis.roasGlobal}
              tacosPct={kpis.tacosPct}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium">Recommandations de l&apos;Agent Publicité</p>
              <RecommendationsList recommandations={recommandations} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Campagnes</p>
              <CampaignsTable campagnes={campagnes} />
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}
