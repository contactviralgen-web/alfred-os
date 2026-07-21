import "server-only"

import { createClient } from "@/lib/supabase/server"

const ORDRE_ROLES_SYSTEME = ["owner", "admin", "manager", "membre", "lecteur"]

export async function listerRolesDisponibles(organizationId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("roles")
    .select("*")
    .or(`organization_id.eq.${organizationId},organization_id.is.null`)

  if (!data) return []

  return data.sort((a, b) => {
    if (a.organization_id === null && b.organization_id === null) {
      return ORDRE_ROLES_SYSTEME.indexOf(a.slug) - ORDRE_ROLES_SYSTEME.indexOf(b.slug)
    }
    if (a.organization_id === null) return -1
    if (b.organization_id === null) return 1
    return a.nom.localeCompare(b.nom)
  })
}
