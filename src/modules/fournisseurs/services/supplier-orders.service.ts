import "server-only"

import { createClient } from "@/lib/supabase/server"

export type StatutCommandeFournisseur =
  | "brouillon"
  | "envoyee"
  | "confirmee"
  | "en_transit"
  | "livree"
  | "annulee"

export type DonneesCommandeFournisseur = {
  supplier_id: string
  numero_commande: string
  statut?: StatutCommandeFournisseur
  montant_total?: number
  date_commande?: string
  date_livraison_prevue?: string | null
  date_livraison_reelle?: string | null
  notes?: string | null
}

export async function listerCommandesFournisseur(workspaceId: string, supplierId?: string) {
  const supabase = await createClient()
  let requete = supabase
    .from("supplier_orders")
    .select("*, suppliers(nom)")
    .eq("workspace_id", workspaceId)
    .order("date_commande", { ascending: false })

  if (supplierId) {
    requete = requete.eq("supplier_id", supplierId)
  }

  const { data } = await requete
  return data ?? []
}

export async function creerCommandeFournisseur(
  organizationId: string,
  workspaceId: string,
  donnees: DonneesCommandeFournisseur
) {
  const supabase = await createClient()
  const { error } = await supabase.from("supplier_orders").insert({
    organization_id: organizationId,
    workspace_id: workspaceId,
    ...donnees,
  })
  if (error) throw new Error("Impossible de créer la commande fournisseur.")
}

export async function mettreAJourStatutCommande(
  orderId: string,
  statut: StatutCommandeFournisseur,
  dateLivraisonReelle?: string | null
) {
  const supabase = await createClient()
  const donnees: { statut: StatutCommandeFournisseur; date_livraison_reelle?: string | null } = {
    statut,
  }
  if (statut === "livree" && dateLivraisonReelle) {
    donnees.date_livraison_reelle = dateLivraisonReelle
  }
  const { error } = await supabase.from("supplier_orders").update(donnees).eq("id", orderId)
  if (error) throw new Error("Impossible de mettre à jour le statut de la commande.")
}
