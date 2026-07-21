"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import {
  accepterInvitation,
  envoyerInvitation,
  revoquerInvitation,
} from "@/modules/core/services/invitations.service"
import { obtenirPremierWorkspaceSlug } from "@/modules/core/services/organizations.service"
import { createClient } from "@/lib/supabase/server"
import type { ResultatAction } from "@/lib/actions/auth.actions"

export async function accepterInvitationAction(token: string): Promise<ResultatAction> {
  let membre
  try {
    membre = await accepterInvitation(token)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  const supabase = await createClient()
  const { data: organisation } = await supabase
    .from("organizations")
    .select("slug")
    .eq("id", membre.organization_id)
    .single()

  const workspaceSlug = await obtenirPremierWorkspaceSlug(membre.organization_id)

  redirect(`/${organisation?.slug}/${workspaceSlug ?? "general"}/tableau-de-bord`)
}

const schemaInvitation = z.object({
  email: z.string().email("Adresse email invalide"),
  roleId: z.string().uuid("Rôle invalide"),
})

export async function envoyerInvitationAction(
  organizationId: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaInvitation.safeParse(input)
  if (!analyse.success) {
    return {
      succes: false,
      message: analyse.error.issues[0]?.message ?? "Formulaire invalide.",
    }
  }

  try {
    await envoyerInvitation(organizationId, analyse.data.email, analyse.data.roleId)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  return { succes: true, message: "Invitation envoyée." }
}

export async function revoquerInvitationAction(invitationId: string): Promise<ResultatAction> {
  try {
    await revoquerInvitation(invitationId)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
  return { succes: true }
}
