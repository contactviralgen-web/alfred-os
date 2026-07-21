import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { TeamFormDialog } from "@/components/settings/team-form-dialog"
import { TeamsTable } from "@/components/settings/teams-table"
import { exigerContexteOrganisation } from "@/lib/auth/guards"
import { listerEquipes } from "@/modules/core/services/teams.service"

export const metadata: Metadata = { title: "Équipes — Business Pilot" }

export default async function ParametresEquipesPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const { organisation, permissions } = await exigerContexteOrganisation(orgSlug)
  const equipes = await listerEquipes(organisation.id)
  const peutGerer = permissions.includes("core.teams.manage")

  return (
    <>
      <PageHeader
        titre="Équipes"
        description="Regroupez vos collaborateurs par équipe"
        actions={peutGerer ? <TeamFormDialog organizationId={organisation.id} /> : undefined}
      />
      <div className="p-6">
        <TeamsTable equipes={equipes} peutGerer={peutGerer} />
      </div>
    </>
  )
}
