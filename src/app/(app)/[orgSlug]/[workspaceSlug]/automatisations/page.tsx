import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { RulesList } from "@/components/automation/rules-list"
import { ExecutionsList } from "@/components/automation/executions-list"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { listerExecutions, listerRegles } from "@/modules/automation/services/automation.service"

export const metadata: Metadata = { title: "Automatisations — Pilot" }

export default async function AutomatisationsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)

  const [regles, executions] = await Promise.all([
    listerRegles(workspace.id),
    listerExecutions(workspace.id),
  ])

  return (
    <>
      <PageHeader
        titre="Automatisations"
        description="Des règles réellement appliquées sur vos données — tâches et notifications créées pour de vrai"
      />
      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2">
        <RulesList regles={regles} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
        <ExecutionsList executions={executions} />
      </div>
    </>
  )
}
