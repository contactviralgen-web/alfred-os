"use server"

import { revalidatePath } from "next/cache"

import {
  poserQuestionDirecteur,
  type MessageChat,
} from "@/modules/agents/services/directeur.service"
import { genererRapportHebdomadaire } from "@/agents/executive"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import type { ResultatAction } from "@/lib/actions/auth.actions"

export async function poserQuestionDirecteurAction(
  organisationNom: string,
  workspaceId: string,
  historique: MessageChat[],
  question: string
) {
  if (!question.trim()) {
    return { succes: false as const, message: "Pose une question." }
  }
  return poserQuestionDirecteur(organisationNom, workspaceId, historique, question)
}

export async function genererRapportAction(orgSlug: string, wsSlug: string): Promise<ResultatAction> {
  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await genererRapportHebdomadaire(organisation.id, workspace.id)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/directeur-ia`)
  return { succes: true, message: "Rapport hebdomadaire généré." }
}
