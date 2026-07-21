"use server"

import {
  poserQuestionDirecteur,
  type MessageChat,
} from "@/modules/agents/services/directeur.service"

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
