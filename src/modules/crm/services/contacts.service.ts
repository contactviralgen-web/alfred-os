import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function listerContacts(workspaceId: string) {
  const supabase = await createClient()
  const [{ data: contacts }, { data: resumes }] = await Promise.all([
    supabase
      .from("crm_contacts")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("cree_le", { ascending: false }),
    supabase.from("v_crm_contact_summary").select("*").eq("workspace_id", workspaceId),
  ])

  const resumeParContact = new Map((resumes ?? []).map((r) => [r.contact_id, r]))

  return (contacts ?? []).map((contact) => ({
    ...contact,
    resume: resumeParContact.get(contact.id) ?? null,
  }))
}

export async function obtenirContact(workspaceId: string, contactId: string) {
  const supabase = await createClient()
  const [{ data: contact }, { data: resume }, { data: commandes }, { data: activites }] =
    await Promise.all([
      supabase
        .from("crm_contacts")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("id", contactId)
        .maybeSingle(),
      supabase
        .from("v_crm_contact_summary")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("contact_id", contactId)
        .maybeSingle(),
      supabase
        .from("orders")
        .select("id, numero_commande, canal, statut, montant_total, cree_le")
        .eq("workspace_id", workspaceId)
        .eq("contact_id", contactId)
        .order("cree_le", { ascending: false }),
      supabase
        .from("crm_activities")
        .select("*, profiles(nom_complet, email)")
        .eq("workspace_id", workspaceId)
        .eq("contact_id", contactId)
        .order("date_activite", { ascending: false }),
    ])

  if (!contact) return null

  return { contact, resume, commandes: commandes ?? [], activites: activites ?? [] }
}

export async function mettreAJourContact(
  contactId: string,
  donnees: { prenom?: string; nom?: string; email?: string; telephone?: string; notes?: string }
) {
  const supabase = await createClient()
  const { error } = await supabase.from("crm_contacts").update(donnees).eq("id", contactId)
  if (error) throw new Error("Impossible de mettre à jour le contact.")
}

export async function ajouterActivite(
  organizationId: string,
  workspaceId: string,
  contactId: string,
  type: "note" | "appel" | "email" | "rdv",
  contenu: string
) {
  const supabase = await createClient()
  const { error } = await supabase.from("crm_activities").insert({
    organization_id: organizationId,
    workspace_id: workspaceId,
    contact_id: contactId,
    type,
    contenu,
  })
  if (error) throw new Error("Impossible d'ajouter l'activité.")
}
