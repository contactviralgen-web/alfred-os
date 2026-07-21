import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database.types"

// getClaims() vérifie le JWT localement via les clés de signature asymétriques
// du projet (ES256) plutôt que d'appeler le serveur Auth à chaque fois comme
// le fait getUser() — la différence est significative sur des fonctions
// serverless éphémères où chaque aller-retour réseau vers Supabase compte.
// cache() évite en plus qu'un même rendu (layout + page + plusieurs services)
// ne refasse cette vérification plusieurs fois pour la même requête.
export const getUtilisateurConnecte = cache(async (): Promise<{ id: string } | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data) return null
  return { id: data.claims.sub }
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
