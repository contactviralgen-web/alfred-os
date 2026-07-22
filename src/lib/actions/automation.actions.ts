"use server"

import { revalidatePath } from "next/cache"

import type { ResultatAction } from "@/lib/actions/auth.actions"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import {
  basculerRegleActive,
  creerRegle,
  executerAutomatisations,
} from "@/modules/automation/services/automation.service"
import { schemaRegleAutomatisation } from "@/lib/validations/automation.schema"

export async function creerRegleAction(
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaRegleAutomatisation.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await creerRegle(organisation.id, workspace.id, analyse.data)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/automatisations`)
  return { succes: true, message: "Règle créée." }
}

export async function basculerRegleActiveAction(
  orgSlug: string,
  wsSlug: string,
  ruleId: string,
  actif: boolean
): Promise<ResultatAction> {
  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await basculerRegleActive(ruleId, actif)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/automatisations`)
  return { succes: true, message: actif ? "Règle activée." : "Règle désactivée." }
}

export type ResultatExecution = { succes: true; resultats: string[] } | { succes: false; message: string }

export async function executerAutomatisationsAction(orgSlug: string, wsSlug: string): Promise<ResultatExecution> {
  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    const resultats = await executerAutomatisations(organisation.id, workspace.id)
    revalidatePath(`/${orgSlug}/${wsSlug}/automatisations`)
    revalidatePath(`/${orgSlug}/${wsSlug}/tableau-de-bord`)
    return { succes: true, resultats }
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
}
