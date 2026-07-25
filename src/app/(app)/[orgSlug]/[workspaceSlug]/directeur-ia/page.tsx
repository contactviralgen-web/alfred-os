import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { DirecteurChat } from "@/components/agents/directeur-chat"
import { WeeklyReportPanel } from "@/components/agents/weekly-report-panel"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { obtenirDernierRapport } from "@/agents/executive"

export const metadata: Metadata = { title: "Directeur IA — Pilot" }

export default async function DirecteurIaPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)
  const rapport = await obtenirDernierRapport(workspace.id)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        titre="Directeur IA"
        description="Votre copilote pour piloter l'entreprise au quotidien"
      />
      <WeeklyReportPanel rapport={rapport} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      <div className="flex-1 overflow-hidden">
        <DirecteurChat organisationNom={organisation.nom} workspaceId={workspace.id} />
      </div>
    </div>
  )
}
