import "server-only"

import { createClient } from "@/lib/supabase/server"

export type OrganizationProfile = {
  id: string
  name: string
  slug: string
  role: "owner" | "admin" | "member"
  industry: string | null
  businessDescription: string | null
  salesChannels: string[]
  targetMarginPct: number | null
  currency: string
}

export type AccountProfile = {
  id: string
  email: string | null
  fullName: string | null
}

export async function getSettingsData(): Promise<{
  account: AccountProfile | null
  organization: OrganizationProfile | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { account: null, organization: null }
  }

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase
      .from("organization_members")
      .select(
        "role, organizations(id, name, slug, industry, business_description, sales_channels, target_margin_pct, currency)"
      )
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle(),
  ])

  type OrgRow = {
    id: string
    name: string
    slug: string
    industry: string | null
    business_description: string | null
    sales_channels: string[] | null
    target_margin_pct: number | null
    currency: string
  }

  const organizationRow = membership?.organizations as OrgRow | OrgRow[] | null
  const org = Array.isArray(organizationRow) ? organizationRow[0] : organizationRow

  return {
    account: {
      id: user.id,
      email: user.email ?? null,
      fullName: profile?.full_name ?? null,
    },
    organization:
      membership && org
        ? {
            id: org.id,
            name: org.name,
            slug: org.slug,
            role: membership.role,
            industry: org.industry,
            businessDescription: org.business_description,
            salesChannels: org.sales_channels ?? [],
            targetMarginPct: org.target_margin_pct,
            currency: org.currency,
          }
        : null,
  }
}
