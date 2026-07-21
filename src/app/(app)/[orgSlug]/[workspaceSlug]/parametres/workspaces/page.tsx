import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { WorkspaceList } from "@/components/settings/workspace-list"
import { exigerContexteOrganisation } from "@/lib/auth/guards"
import { listerWorkspaces } from "@/modules/core/services/workspaces.service"

export const metadata: Metadata = { title: "Workspaces — Alfred OS" }

export default async function ParametresWorkspacesPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const { organisation, permissions } = await exigerContexteOrganisation(orgSlug)
  const workspaces = await listerWorkspaces(organisation.id)

  return (
    <>
      <PageHeader
        titre="Workspaces"
        description="Les espaces de travail de votre organisation"
      />
      <div className="p-6">
        <WorkspaceList
          organizationId={organisation.id}
          orgSlug={orgSlug}
          workspaces={workspaces}
          peutGerer={permissions.includes("core.workspace.manage")}
        />
      </div>
    </>
  )
}
