import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function obtenirApercuInvitation(token: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc("get_invitation_preview", { p_token: token })
    .maybeSingle()

  if (error || !data) return null
  return data
}

export async function accepterInvitation(token: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("accept_invitation", {
    p_token: token,
  })

  if (error) {
    throw new Error(
      error.message.includes("expirée") || error.message.includes("invalide")
        ? "Cette invitation est invalide ou a expiré."
        : "Impossible d'accepter cette invitation."
    )
  }

  return data
}

export async function envoyerInvitation(
  organizationId: string,
  email: string,
  roleId: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invitations")
    .insert({ organization_id: organizationId, email, role_id: roleId })
    .select()
    .single()

  if (error) {
    throw new Error("Impossible d'envoyer l'invitation.")
  }

  return data
}

export async function listerInvitationsOrganisation(organizationId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("invitations")
    .select("*, roles(nom)")
    .eq("organization_id", organizationId)
    .order("cree_le", { ascending: false })

  return data ?? []
}

export async function revoquerInvitation(invitationId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("invitations")
    .update({ statut: "revoquee" })
    .eq("id", invitationId)

  if (error) {
    throw new Error("Impossible de révoquer l'invitation.")
  }
}
