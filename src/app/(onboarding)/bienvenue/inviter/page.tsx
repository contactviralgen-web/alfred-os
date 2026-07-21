import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AuthCard } from "@/components/auth/auth-card"
import { InviteMembersForm } from "@/components/onboarding/invite-members-form"
import { obtenirOrganisationParSlug, obtenirPremierWorkspaceSlug } from "@/modules/core/services/organizations.service"
import { listerRolesDisponibles } from "@/modules/core/services/roles.service"

export const metadata: Metadata = { title: "Inviter votre équipe — Alfred OS" }

export default async function InviterPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>
}) {
  const { org } = await searchParams
  if (!org) {
    redirect("/bienvenue")
  }

  const organisation = await obtenirOrganisationParSlug(org)
  if (!organisation) {
    redirect("/bienvenue")
  }

  const [workspaceSlug, roles] = await Promise.all([
    obtenirPremierWorkspaceSlug(organisation.id),
    listerRolesDisponibles(organisation.id),
  ])

  const roleMembre = roles.find((r) => r.slug === "membre" && r.organization_id === null)

  return (
    <AuthCard
      titre="Invitez votre équipe"
      description={`Ajoutez des collègues à ${organisation.nom} (facultatif)`}
    >
      <InviteMembersForm
        organizationId={organisation.id}
        organizationSlug={organisation.slug}
        workspaceSlug={workspaceSlug ?? "general"}
        roleMembreId={roleMembre?.id ?? ""}
      />
    </AuthCard>
  )
}
