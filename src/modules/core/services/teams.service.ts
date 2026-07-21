import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function listerEquipes(organizationId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("teams")
    .select("*, team_members(count)")
    .eq("organization_id", organizationId)
    .order("cree_le", { ascending: true })
  return data ?? []
}

export async function creerEquipe(organizationId: string, nom: string, description?: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("teams")
    .insert({ organization_id: organizationId, nom, description })

  if (error) {
    throw new Error("Impossible de créer l'équipe.")
  }
}

export async function supprimerEquipe(teamId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("teams").delete().eq("id", teamId)

  if (error) {
    throw new Error("Impossible de supprimer l'équipe.")
  }
}
