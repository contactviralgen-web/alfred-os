import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database.types"

// cache() évite qu'un même rendu serveur (layout + page + plusieurs services)
// ne revalide plusieurs fois le même JWT auprès de Supabase Auth — chaque
// appel non mis en cache est un aller-retour réseau à part entière.
export const getUtilisateurConnecte = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export async function exigerUtilisateurConnecte() {
  const user = await getUtilisateurConnecte()
  if (!user) {
    redirect("/connexion")
  }
  return user
}

export const getProfil = cache(async (): Promise<Tables<"profiles"> | null> => {
  const user = await getUtilisateurConnecte()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data
})
