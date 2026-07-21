import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function obtenirMatriceRolesPermissions(organizationId: string) {
  const supabase = await createClient()

  const [{ data: permissions }, { data: roles }, { data: rolePermissions }] = await Promise.all([
    supabase.from("permissions").select("*").order("module"),
    supabase
      .from("roles")
      .select("*")
      .or(`organization_id.eq.${organizationId},organization_id.is.null`),
    supabase
      .from("role_permissions")
      .select("role_id, permission_id, roles!inner(organization_id)")
      .or("organization_id.eq." + organizationId + ",organization_id.is.null", {
        referencedTable: "roles",
      }),
  ])

  const rolesTriees = (roles ?? []).sort((a, b) => {
    if (a.organization_id === null && b.organization_id !== null) return -1
    if (a.organization_id !== null && b.organization_id === null) return 1
    return a.nom.localeCompare(b.nom)
  })

  const accordees = new Set(
    (rolePermissions ?? []).map((rp) => `${rp.role_id}:${rp.permission_id}`)
  )

  return {
    permissions: permissions ?? [],
    roles: rolesTriees,
    aPermission: (roleId: string, permissionId: string) =>
      accordees.has(`${roleId}:${permissionId}`),
  }
}
