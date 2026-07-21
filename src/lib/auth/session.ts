import "server-only"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database.types"

export async function getUtilisateurConnecte() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function exigerUtilisateurConnecte() {
  const user = await getUtilisateurConnecte()
  if (!user) {
    redirect("/connexion")
  }
  return user
}

export async function getProfil(): Promise<Tables<"profiles"> | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data
}
