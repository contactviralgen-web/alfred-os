import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function obtenirCommandesBloquees(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("orders")
    .select("id, numero_commande, client_nom, montant_total, canal, cree_le")
    .eq("workspace_id", workspaceId)
    .eq("statut", "bloquee")
    .order("cree_le", { ascending: false })
    .limit(10)
  return data ?? []
}

export async function obtenirRepartitionStatuts(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("orders")
    .select("statut")
    .eq("workspace_id", workspaceId)
    .gte("cree_le", new Date(Date.now() - 30 * 86400000).toISOString())

  const parStatut = new Map<string, number>()
  for (const ligne of data ?? []) {
    parStatut.set(ligne.statut, (parStatut.get(ligne.statut) ?? 0) + 1)
  }
  return Array.from(parStatut.entries()).map(([statut, total]) => ({ statut, total }))
}

export async function obtenirTopProduits(workspaceId: string, limite = 5) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("v_top_products")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("marge_totale", { ascending: false })
    .limit(limite)
  return data ?? []
}
