"use server"

import { revalidatePath } from "next/cache"

import type { ResultatAction } from "@/lib/actions/auth.actions"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { ajouterRetour, connecterAmazon, deconnecterAmazon } from "@/modules/amazon/services/amazon.service"
import { schemaRetour } from "@/lib/validations/amazon.schema"

export async function connecterAmazonAction(orgSlug: string, wsSlug: string): Promise<ResultatAction> {
  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await connecterAmazon(organisation.id, workspace.id)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/amazon`)
  return { succes: true, message: "Compte Amazon connecté (démo)." }
}

export async function deconnecterAmazonAction(orgSlug: string, wsSlug: string): Promise<ResultatAction> {
  const { workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await deconnecterAmazon(workspace.id)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/amazon`)
  return { succes: true, message: "Compte Amazon déconnecté." }
}

export async function ajouterRetourAction(
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaRetour.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await ajouterRetour(organisation.id, workspace.id, analyse.data)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/amazon`)
  return { succes: true, message: "Retour enregistré." }
}
