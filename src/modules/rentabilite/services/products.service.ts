import "server-only"

import { createClient } from "@/lib/supabase/server"

export type ProduitSimple = {
  id: string
  sku: string
  nom: string
  categorie: string | null
  prixAchat: number
  prixVente: number
}

export async function listerProduitsSimple(workspaceId: string): Promise<ProduitSimple[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("id, sku, nom, categorie, prix_achat, prix_vente")
    .eq("workspace_id", workspaceId)
    .eq("actif", true)
    .order("nom")

  return (data ?? []).map((p) => ({
    id: p.id,
    sku: p.sku,
    nom: p.nom,
    categorie: p.categorie,
    prixAchat: Number(p.prix_achat),
    prixVente: Number(p.prix_vente),
  }))
}

export type DonneesNouveauProduit = {
  sku: string
  nom: string
  categorie?: string | null
  prixAchat: number
  prixVente: number
  margePlancherPct: number
}

// sku/nom/prix de vente sont conceptuellement des champs qu'Amazon SP-API
// synchroniserait automatiquement une fois connecté (catalogue produit) ;
// prix d'achat, catégorie et marge plancher restent toujours saisis
// manuellement (Amazon ne connaît jamais le coût fournisseur ni le seuil de
// marge minimum souhaité par le vendeur).
export async function creerProduit(
  organizationId: string,
  workspaceId: string,
  donnees: DonneesNouveauProduit
): Promise<ProduitSimple> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .insert({
      organization_id: organizationId,
      workspace_id: workspaceId,
      sku: donnees.sku,
      nom: donnees.nom,
      categorie: donnees.categorie ?? null,
      prix_achat: donnees.prixAchat,
      prix_vente: donnees.prixVente,
    })
    .select("id, sku, nom, categorie, prix_achat, prix_vente")
    .single()

  if (error || !data) {
    if (error?.code === "23505") {
      throw new Error(`Le SKU "${donnees.sku}" existe déjà.`)
    }
    throw new Error("Impossible de créer le produit.")
  }

  // Le trigger `creer_product_cost_settings_apres_produit` vient de créer une
  // ligne de charges par défaut pour ce produit — on y applique la marge
  // plancher choisie à la création.
  await supabase
    .from("product_cost_settings")
    .update({ marge_plancher_pct: donnees.margePlancherPct })
    .eq("product_id", data.id)

  return {
    id: data.id,
    sku: data.sku,
    nom: data.nom,
    categorie: data.categorie,
    prixAchat: Number(data.prix_achat),
    prixVente: Number(data.prix_vente),
  }
}
