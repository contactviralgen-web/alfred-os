"use server"

import { z } from "zod"

import { creerEquipe, supprimerEquipe } from "@/modules/core/services/teams.service"
import type { ResultatAction } from "@/lib/actions/auth.actions"

const schemaEquipe = z.object({
  nom: z.string().min(2, "Le nom de l'équipe doit contenir au moins 2 caractères"),
  description: z.string().optional(),
})

export async function creerEquipeAction(
  organizationId: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaEquipe.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  try {
    await creerEquipe(organizationId, analyse.data.nom, analyse.data.description)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  return { succes: true, message: "Équipe créée." }
}

export async function supprimerEquipeAction(teamId: string): Promise<ResultatAction> {
  try {
    await supprimerEquipe(teamId)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
  return { succes: true }
}
