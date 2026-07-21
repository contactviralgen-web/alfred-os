import "server-only"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"

export async function listerWorkspaces(organizationId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("workspaces")
    .select("*")
    .eq("organization_id", organizationId)
    .order("cree_le", { ascending: true })
  return data ?? []
}

export async function obtenirWorkspaceParSlug(organizationId: string, slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("workspaces")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("slug", slug)
    .maybeSingle()
  return data
}

export async function creerWorkspace(organizationId: string, nom: string) {
  const supabase = await createClient()
  const slugBase = slugify(nom) || "workspace"

  let slug = slugBase
  for (let tentative = 0; tentative < 5; tentative += 1) {
    const { data, error } = await supabase
      .from("workspaces")
      .insert({ organization_id: organizationId, nom, slug })
      .select()
      .single()

    if (!error) return data

    if (error.code === "23505") {
      slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`
      continue
    }

    throw new Error("Impossible de créer le workspace.")
  }

  throw new Error("Impossible de générer un identifiant unique pour le workspace.")
}
