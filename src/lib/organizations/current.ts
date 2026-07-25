import "server-only"

import { createClient } from "@/lib/supabase/server"

export type CurrentOrganization = {
  id: string
  name: string
  slug: string
  role: "owner" | "admin" | "member"
}

export type CurrentUser = {
  id: string
  email: string | null
  fullName: string | null
}

export async function getCurrentUserAndOrganization(): Promise<{
  user: CurrentUser | null
  organization: CurrentOrganization | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, organization: null }
  }

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase
      .from("organization_members")
      .select("role, organizations(id, name, slug)")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle(),
  ])

  const organizationRow = membership?.organizations as
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null

  const organization = Array.isArray(organizationRow)
    ? organizationRow[0]
    : organizationRow

  return {
    user: {
      id: user.id,
      email: user.email ?? null,
      fullName: profile?.full_name ?? null,
    },
    organization:
      membership && organization
        ? {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            role: membership.role,
          }
        : null,
  }
}
