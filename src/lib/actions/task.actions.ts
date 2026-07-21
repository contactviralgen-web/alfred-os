"use server"

import { revalidatePath } from "next/cache"

import { basculerStatutTache } from "@/modules/dashboard/services/productivity.service"
import type { ResultatAction } from "@/lib/actions/auth.actions"

export async function basculerStatutTacheAction(
  taskId: string,
  statut: "a_faire" | "terminee",
  orgSlug: string,
  workspaceSlug: string
): Promise<ResultatAction> {
  try {
    await basculerStatutTache(taskId, statut)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
  revalidatePath(`/${orgSlug}/${workspaceSlug}/tableau-de-bord`)
  return { succes: true }
}
