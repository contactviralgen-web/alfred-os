import "server-only"

import { createClient } from "@/lib/supabase/server"
import { getUtilisateurConnecte } from "@/lib/auth/session"

export async function listerTachesUtilisateur(workspaceId: string) {
  const user = await getUtilisateurConnecte()
  if (!user) return []

  const supabase = await createClient()

  const { data } = await supabase
    .from("tasks")
    .select("id, titre, statut, priorite, echeance_le")
    .eq("workspace_id", workspaceId)
    .eq("assigne_a", user.id)
    .neq("statut", "terminee")
    .order("echeance_le", { ascending: true })
    .limit(6)
  return data ?? []
}

export async function basculerStatutTache(taskId: string, statut: "a_faire" | "terminee") {
  const supabase = await createClient()
  const { error } = await supabase.from("tasks").update({ statut }).eq("id", taskId)
  if (error) throw new Error("Impossible de mettre à jour la tâche.")
}

export async function listerProchainsEvenements(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("calendar_events")
    .select("id, titre, type, debut_le")
    .eq("workspace_id", workspaceId)
    .gte("debut_le", new Date().toISOString())
    .order("debut_le", { ascending: true })
    .limit(5)
  return data ?? []
}

export async function listerNotificationsUtilisateur(limite = 8) {
  const user = await getUtilisateurConnecte()
  if (!user) return []

  const supabase = await createClient()

  const { data } = await supabase
    .from("notifications")
    .select("id, titre, message, lien, lue, cree_le")
    .eq("destinataire_id", user.id)
    .order("cree_le", { ascending: false })
    .limit(limite)
  return data ?? []
}

export async function marquerNotificationLue(notificationId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ lue: true })
    .eq("id", notificationId)
  if (error) throw new Error("Impossible de mettre à jour la notification.")
}

export async function marquerToutesNotificationsLues() {
  const user = await getUtilisateurConnecte()
  if (!user) return

  const supabase = await createClient()

  const { error } = await supabase
    .from("notifications")
    .update({ lue: true })
    .eq("destinataire_id", user.id)
    .eq("lue", false)
  if (error) throw new Error("Impossible de mettre à jour les notifications.")
}
