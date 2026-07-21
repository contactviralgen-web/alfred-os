"use server"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import type { ResultatAction } from "@/lib/actions/auth.actions"

const schemaProfil = z.object({
  nomComplet: z.string().min(2, "Votre nom doit contenir au moins 2 caractères"),
})

export async function mettreAJourProfilAction(input: unknown): Promise<ResultatAction> {
  const analyse = schemaProfil.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { succes: false, message: "Session expirée." }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ nom_complet: analyse.data.nomComplet })
    .eq("id", user.id)

  if (error) {
    return { succes: false, message: "Impossible de mettre à jour le profil." }
  }

  return { succes: true, message: "Profil mis à jour." }
}

const schemaMotDePasse = z
  .object({
    motDePasse: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmation: z.string(),
  })
  .refine((data) => data.motDePasse === data.confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmation"],
  })

export async function changerMotDePasseAction(input: unknown): Promise<ResultatAction> {
  const analyse = schemaMotDePasse.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: analyse.data.motDePasse })

  if (error) {
    return { succes: false, message: "Impossible de mettre à jour le mot de passe." }
  }

  return { succes: true, message: "Mot de passe mis à jour." }
}
