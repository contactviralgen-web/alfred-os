"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function toSlug(name: string) {
  const withoutDiacritics = name
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
  return (
    withoutDiacritics.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
    "organisation"
  )
}

export async function createOrganization(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  if (!name) {
    redirect("/onboarding?error=Le nom de l'entreprise est requis")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  const slug = `${toSlug(name)}-${user.id.slice(0, 6)}`
  const organizationId = crypto.randomUUID()

  // Pas de .select() ici : avant l'insertion du membership ci-dessous,
  // l'utilisateur n'est pas encore membre de cette organisation, donc la
  // policy RLS de lecture (is_organization_member) rejetterait un RETURNING.
  const { error: organizationError } = await supabase
    .from("organizations")
    .insert({ id: organizationId, name, slug })

  if (organizationError) {
    redirect(
      `/onboarding?error=${encodeURIComponent(organizationError.message)}`
    )
  }

  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({ organization_id: organizationId, user_id: user.id, role: "owner" })

  if (memberError) {
    redirect(`/onboarding?error=${encodeURIComponent(memberError.message)}`)
  }

  redirect("/")
}
