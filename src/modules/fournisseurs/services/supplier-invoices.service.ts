import "server-only"

import { createClient } from "@/lib/supabase/server"

export type StatutFactureFournisseur = "en_attente" | "payee" | "en_retard"

export type DonneesFactureFournisseur = {
  supplier_id: string
  supplier_order_id?: string | null
  numero_facture: string
  montant: number
  statut?: StatutFactureFournisseur
  date_emission?: string
  date_echeance?: string | null
}

export async function listerFacturesFournisseur(workspaceId: string, supplierId?: string) {
  const supabase = await createClient()
  let requete = supabase
    .from("supplier_invoices")
    .select("*, suppliers(nom)")
    .eq("workspace_id", workspaceId)
    .order("date_emission", { ascending: false })

  if (supplierId) {
    requete = requete.eq("supplier_id", supplierId)
  }

  const { data } = await requete
  return data ?? []
}

export async function creerFacture(
  organizationId: string,
  workspaceId: string,
  donnees: DonneesFactureFournisseur
) {
  const supabase = await createClient()
  const { error } = await supabase.from("supplier_invoices").insert({
    organization_id: organizationId,
    workspace_id: workspaceId,
    ...donnees,
  })
  if (error) throw new Error("Impossible de créer la facture.")
}

export async function marquerFacturePayee(invoiceId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("supplier_invoices")
    .update({ statut: "payee", date_paiement: new Date().toISOString().slice(0, 10) })
    .eq("id", invoiceId)
  if (error) throw new Error("Impossible de marquer la facture comme payée.")
}
