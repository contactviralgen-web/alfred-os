"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import {
  ajouterActivite,
  mettreAJourContact,
} from "@/modules/crm/services/contacts.service"
import type { ResultatAction } from "@/lib/actions/auth.actions"

const schemaActivite = z.object({
  type: z.enum(["note", "appel", "email", "rdv"]),
  contenu: z.string().min(1, "Le contenu ne peut pas être vide"),
})

export async function ajouterActiviteAction(
  organizationId: string,
  workspaceId: string,
  contactId: string,
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaActivite.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  try {
    await ajouterActivite(
      organizationId,
      workspaceId,
      contactId,
      analyse.data.type,
      analyse.data.contenu
    )
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/crm/${contactId}`)
  return { succes: true }
}

const schemaContact = z.object({
  prenom: z.string().optional(),
  nom: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().optional(),
})

export async function mettreAJourContactAction(
  contactId: string,
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaContact.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  try {
    await mettreAJourContact(contactId, analyse.data)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/crm/${contactId}`)
  return { succes: true, message: "Contact mis à jour." }
}
