import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function listerActiviteRecente(organizationId: string, limite = 50) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("activity_log")
    .select("id, action, cible_type, metadonnees, cree_le, profiles(nom_complet, email)")
    .eq("organization_id", organizationId)
    .order("cree_le", { ascending: false })
    .limit(limite)
  return data ?? []
}
