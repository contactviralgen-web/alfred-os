import { redirect } from "next/navigation"

import { exigerContexteOrganisation } from "@/lib/auth/guards"
import { obtenirPremierWorkspaceSlug } from "@/modules/core/services/organizations.service"

export default async function OrganisationRootPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const { organisation } = await exigerContexteOrganisation(orgSlug)
  const workspaceSlug = await obtenirPremierWorkspaceSlug(organisation.id)
  redirect(`/${orgSlug}/${workspaceSlug ?? "general"}/tableau-de-bord`)
}
