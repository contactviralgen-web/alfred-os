"use server"

import { revalidatePath } from "next/cache"

import {
  marquerNotificationLue,
  marquerToutesNotificationsLues,
} from "@/modules/dashboard/services/productivity.service"
import type { ResultatAction } from "@/lib/actions/auth.actions"

export async function marquerNotificationLueAction(
  notificationId: string,
  orgSlug: string,
  workspaceSlug: string
): Promise<ResultatAction> {
  try {
    await marquerNotificationLue(notificationId)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
  revalidatePath(`/${orgSlug}/${workspaceSlug}/notifications`)
  return { succes: true }
}

export async function marquerToutesNotificationsLuesAction(
  orgSlug: string,
  workspaceSlug: string
): Promise<ResultatAction> {
  try {
    await marquerToutesNotificationsLues()
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
  revalidatePath(`/${orgSlug}/${workspaceSlug}/notifications`)
  return { succes: true }
}
