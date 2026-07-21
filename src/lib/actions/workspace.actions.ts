"use server"

import { z } from "zod"

import { creerWorkspace } from "@/modules/core/services/workspaces.service"
import type { ResultatAction } from "@/lib/actions/auth.actions"

const schemaWorkspace = z.object({
  nom: z.string().min(2, "Le nom du workspace doit contenir au moins 2 caractères"),
})

export async function creerWorkspaceAction(
  organizationId: string,
  input: unknown
): Promise<ResultatAction & { slug?: string }> {
  const analyse = schemaWorkspace.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  try {
    const workspace = await creerWorkspace(organizationId, analyse.data.nom)
    return { succes: true, slug: workspace.slug }
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
}
