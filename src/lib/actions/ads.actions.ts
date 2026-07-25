"use server"

import { revalidatePath } from "next/cache"

import type { ResultatAction } from "@/lib/actions/auth.actions"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { connecterPlateformePub, deconnecterPlateformePub } from "@/connectors/ads/ads.service"
import { LABEL_PLATEFORME, type PlateformePub } from "@/connectors/ads/ads.constants"
import { analyserCampagnes } from "@/agents/ads"

export async function connecterPubAction(
  orgSlug: string,
  wsSlug: string,
  plateforme: PlateformePub
): Promise<ResultatAction> {
  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await connecterPlateformePub(organisation.id, workspace.id, plateforme)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/publicite`)
  return { succes: true, message: `${LABEL_PLATEFORME[plateforme]} connecté (démo).` }
}

export async function deconnecterPubAction(
  orgSlug: string,
  wsSlug: string,
  plateforme: PlateformePub
): Promise<ResultatAction> {
  const { workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await deconnecterPlateformePub(workspace.id, plateforme)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/publicite`)
  return { succes: true, message: `${LABEL_PLATEFORME[plateforme]} déconnecté.` }
}

export async function analyserCampagnesAction(orgSlug: string, wsSlug: string): Promise<ResultatAction> {
  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    const { campagnesAnalysees, recommandationsCreees } = await analyserCampagnes(organisation.id, workspace.id)
    revalidatePath(`/${orgSlug}/${wsSlug}/publicite`)
    return {
      succes: true,
      message:
        recommandationsCreees > 0
          ? `${recommandationsCreees} recommandation(s) générée(s) sur ${campagnesAnalysees} campagne(s) analysée(s).`
          : `${campagnesAnalysees} campagne(s) analysée(s), aucune anomalie détectée.`,
    }
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
}
