import "server-only"

import { createClient } from "@/lib/supabase/server"
import { getUtilisateurConnecte } from "@/lib/auth/session"

export async function obtenirMembershipUtilisateur(organizationId: string) {
  const user = await getUtilisateurConnecte()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from("organization_members")
    .select("*, roles(nom, slug)")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .eq("statut", "actif")
    .maybeSingle()

  return data
}

export async function listerPermissionsUtilisateur(
  organizationId: string
): Promise<string[]> {
  const user = await getUtilisateurConnecte()
  if (!user) return []

  const supabase = await createClient()

  const { data } = await supabase
    .from("organization_members")
    .select("roles(role_permissions(permissions(cle)))")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .eq("statut", "actif")
    .maybeSingle()

  const role = data?.roles as unknown as
    | { role_permissions: { permissions: { cle: string } | null }[] }
    | null

  if (!role) return []

  return role.role_permissions
    .map((rp) => rp.permissions?.cle)
    .filter((cle): cle is string => Boolean(cle))
}

export async function listerMembresOrganisation(organizationId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("organization_members")
    .select("*, profiles!user_id(nom_complet, email, avatar_url), roles(nom, slug)")
    .eq("organization_id", organizationId)
    .order("cree_le", { ascending: true })
  return data ?? []
}
