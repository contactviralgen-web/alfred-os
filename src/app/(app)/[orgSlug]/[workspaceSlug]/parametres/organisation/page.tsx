import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { OrganizationSettingsForm } from "@/components/settings/organization-settings-form"
import { exigerContexteOrganisation } from "@/lib/auth/guards"

export const metadata: Metadata = { title: "Organisation — Pilot" }

export default async function ParametresOrganisationPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { organisation } = await exigerContexteOrganisation(orgSlug)

  return (
    <>
      <PageHeader
        titre="Organisation"
        description="Informations générales de votre entreprise sur Pilot"
      />
      <div className="p-6">
        <OrganizationSettingsForm
          organizationId={organisation.id}
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
          nom={organisation.nom}
          slug={organisation.slug}
          plan={organisation.plan}
        />
      </div>
    </>
  )
}
