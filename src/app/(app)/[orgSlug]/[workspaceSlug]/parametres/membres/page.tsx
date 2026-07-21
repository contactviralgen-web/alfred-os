import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { InviteMemberDialog } from "@/components/settings/invite-member-dialog"
import { InvitationsList } from "@/components/settings/invitations-list"
import { MembersTable } from "@/components/settings/members-table"
import { exigerContexteOrganisation } from "@/lib/auth/guards"
import { listerMembresOrganisation } from "@/modules/core/services/memberships.service"
import { listerInvitationsOrganisation } from "@/modules/core/services/invitations.service"
import { listerRolesDisponibles } from "@/modules/core/services/roles.service"

export const metadata: Metadata = { title: "Membres — Business Pilot" }

export default async function ParametresMembresPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const { organisation, permissions } = await exigerContexteOrganisation(orgSlug)

  const [membres, invitations, roles] = await Promise.all([
    listerMembresOrganisation(organisation.id),
    listerInvitationsOrganisation(organisation.id),
    listerRolesDisponibles(organisation.id),
  ])

  const peutInviter = permissions.includes("core.members.invite")

  return (
    <>
      <PageHeader
        titre="Membres"
        description={`${membres.length} membre(s) dans ${organisation.nom}`}
        actions={
          peutInviter ? (
            <InviteMemberDialog
              organizationId={organisation.id}
              roles={roles.map((r) => ({ id: r.id, nom: r.nom }))}
            />
          ) : undefined
        }
      />
      <div className="p-6">
        <MembersTable membres={membres} />
        {peutInviter ? <InvitationsList invitations={invitations} /> : null}
      </div>
    </>
  )
}
