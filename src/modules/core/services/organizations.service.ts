import "server-only"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import type { Tables } from "@/types/database.types"

// Liste les organisations dont l'utilisateur courant est membre actif.
export async function listerOrganisationsUtilisateur(): Promise<Tables<"organizations">[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("organization_members")
    .select("organizations(*)")
    .eq("statut", "actif")

  if (error || !data) return []

  return data
    .map((ligne) => ligne.organizations)
    .filter((org): org is Tables<"organizations"> => org !== null)
}

// Workspace le plus ancien d'une organisation, utilisé pour rediriger un
// utilisateur directement vers un espace de travail concret.
export async function obtenirPremierWorkspaceSlug(organizationId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("workspaces")
    .select("slug")
    .eq("organization_id", organizationId)
    .order("cree_le", { ascending: true })
    .limit(1)
    .maybeSingle()
  return data?.slug ?? null
}

export async function creerOrganisation(nom: string) {
  const supabase = await createClient()
  const slugBase = slugify(nom) || "organisation"

  let slug = slugBase
  let tentative = 0

  while (tentative < 5) {
    const { data, error } = await supabase.rpc("create_organization", {
      p_nom: nom,
      p_slug: slug,
    })

    if (!error) {
      return data
    }

    if (error.code === "23505") {
      tentative += 1
      slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`
      continue
    }

    throw new Error("Impossible de créer l'organisation pour le moment.")
  }

  throw new Error("Impossible de générer un identifiant unique pour l'organisation.")
}

export async function obtenirOrganisationParSlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single()
  return data
}

export async function mettreAJourOrganisation(organizationId: string, nom: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("organizations")
    .update({ nom })
    .eq("id", organizationId)

  if (error) {
    throw new Error("Impossible de mettre à jour l'organisation.")
  }

  await supabase.rpc("log_activity", {
    p_organization_id: organizationId,
    p_action: "organisation.modifiee",
    p_cible_type: "organization",
    p_cible_id: organizationId,
    p_metadonnees: { nom },
  })
}
