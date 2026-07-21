import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function obtenirAlertesStock(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("stock_alerts")
    .select("id, type, cree_le, products(nom, categorie)")
    .eq("workspace_id", workspaceId)
    .eq("statut", "ouverte")
    .order("cree_le", { ascending: false })
    .limit(10)
  return data ?? []
}
