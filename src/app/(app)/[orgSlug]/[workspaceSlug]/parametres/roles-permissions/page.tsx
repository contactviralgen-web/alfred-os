import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { RolesPermissionsMatrix } from "@/components/settings/roles-permissions-matrix"
import { exigerContexteOrganisation } from "@/lib/auth/guards"
import { obtenirMatriceRolesPermissions } from "@/modules/core/services/permissions.service"

export const metadata: Metadata = { title: "Rôles & permissions — Alfred OS" }

export default async function ParametresRolesPermissionsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const { organisation } = await exigerContexteOrganisation(orgSlug)
  const { permissions, roles, aPermission } = await obtenirMatriceRolesPermissions(
    organisation.id
  )

  return (
    <>
      <PageHeader
        titre="Rôles & permissions"
        description="Ce que chaque rôle peut faire dans votre organisation"
      />
      <div className="p-6">
        <RolesPermissionsMatrix
          permissions={permissions}
          roles={roles}
          aPermission={aPermission}
        />
      </div>
    </>
  )
}
