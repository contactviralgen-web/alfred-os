"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import {
  creerOrganisation,
  mettreAJourOrganisation,
} from "@/modules/core/services/organizations.service"
import { schemaCreationOrganisation } from "@/lib/validations/organization.schema"
import type { ResultatAction } from "@/lib/actions/auth.actions"

export async function creerOrganisationAction(input: unknown): Promise<ResultatAction> {
  const analyse = schemaCreationOrganisation.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  let organisation
  try {
    organisation = await creerOrganisation(analyse.data.nom)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  redirect(`/bienvenue/inviter?org=${organisation.slug}`)
}

export async function mettreAJourOrganisationAction(
  organizationId: string,
  orgSlug: string,
  workspaceSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaCreationOrganisation.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  try {
    await mettreAJourOrganisation(organizationId, analyse.data.nom)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${workspaceSlug}/parametres/organisation`)
  return { succes: true, message: "Organisation mise à jour." }
}
