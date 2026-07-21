"use server"

import { headers } from "next/headers"

import { createClient } from "@/lib/supabase/server"
import {
  schemaConnexion,
  schemaInscription,
  schemaMagicLink,
  schemaMotDePasseOublie,
} from "@/lib/validations/auth.schema"

export type ResultatAction =
  | { succes: true; message?: string }
  | { succes: false; message: string }

export async function connecterAvecMotDePasse(
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaConnexion.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: "Email ou mot de passe invalide." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: analyse.data.email,
    password: analyse.data.motDePasse,
  })

  if (error) {
    return { succes: false, message: "Email ou mot de passe incorrect." }
  }

  return { succes: true }
}

async function origineSite() {
  const en = await headers()
  const proto = en.get("x-forwarded-proto") ?? "http"
  const host = en.get("host")
  return `${proto}://${host}`
}

export async function inscrire(
  input: unknown,
  next = "/bienvenue"
): Promise<ResultatAction> {
  const analyse = schemaInscription.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  const supabase = await createClient()
  const origine = await origineSite()

  const { error } = await supabase.auth.signUp({
    email: analyse.data.email,
    password: analyse.data.motDePasse,
    options: {
      data: { nom_complet: analyse.data.nomComplet },
      emailRedirectTo: `${origine}/api/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) {
    return {
      succes: false,
      message:
        error.code === "user_already_exists"
          ? "Un compte existe déjà avec cette adresse email."
          : "Impossible de créer le compte pour le moment.",
    }
  }

  return { succes: true }
}

export async function envoyerLienMagique(input: unknown): Promise<ResultatAction> {
  const analyse = schemaMagicLink.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: "Adresse email invalide." }
  }

  const supabase = await createClient()
  const origine = await origineSite()

  const { error } = await supabase.auth.signInWithOtp({
    email: analyse.data.email,
    options: { emailRedirectTo: `${origine}/api/auth/callback` },
  })

  if (error) {
    return { succes: false, message: "Impossible d'envoyer le lien de connexion." }
  }

  return { succes: true, message: "Lien de connexion envoyé par email." }
}

export async function demanderReinitialisationMotDePasse(
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaMotDePasseOublie.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: "Adresse email invalide." }
  }

  const supabase = await createClient()
  const origine = await origineSite()

  const { error } = await supabase.auth.resetPasswordForEmail(analyse.data.email, {
    redirectTo: `${origine}/api/auth/callback?next=/reinitialiser-mot-de-passe`,
  })

  if (error) {
    return { succes: false, message: "Impossible d'envoyer l'email de réinitialisation." }
  }

  return {
    succes: true,
    message: "Si un compte existe avec cette adresse, un email a été envoyé.",
  }
}

export async function deconnecter(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
