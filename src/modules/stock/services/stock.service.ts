import "server-only"

import { createClient } from "@/lib/supabase/server"

export type LigneStock = {
  productId: string
  sku: string
  nom: string
  categorie: string | null
  quantiteDisponible: number
  quantiteReservee: number
  seuilAlerte: number
  statut: "rupture" | "stock_bas" | "sain"
}

// Statut dérivé des niveaux + seuil — même logique que le seed (comparaison
// simple à seuil_alerte), pas de prévision de rupture (hors périmètre).
function statutStock(quantiteDisponible: number, seuilAlerte: number): LigneStock["statut"] {
  if (quantiteDisponible === 0) return "rupture"
  if (quantiteDisponible <= seuilAlerte) return "stock_bas"
  return "sain"
}

export async function listerStock(workspaceId: string): Promise<LigneStock[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("id, sku, nom, categorie, stock_levels(quantite_disponible, quantite_reservee, seuil_alerte)")
    .eq("workspace_id", workspaceId)
    .eq("actif", true)
    .order("nom")

  const lignes = (data ?? []).map((p) => {
    const niveau = Array.isArray(p.stock_levels) ? p.stock_levels[0] : p.stock_levels
    const quantiteDisponible = niveau?.quantite_disponible ?? 0
    const seuilAlerte = niveau?.seuil_alerte ?? 10
    return {
      productId: p.id,
      sku: p.sku,
      nom: p.nom,
      categorie: p.categorie,
      quantiteDisponible,
      quantiteReservee: niveau?.quantite_reservee ?? 0,
      seuilAlerte,
      statut: statutStock(quantiteDisponible, seuilAlerte),
    }
  })

  const ordreStatut = { rupture: 0, stock_bas: 1, sain: 2 }
  return lignes.sort((a, b) => ordreStatut[a.statut] - ordreStatut[b.statut])
}

export async function listerMouvementsRecents(workspaceId: string, limite = 10) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("stock_movements")
    .select("id, type, quantite, motif, cree_le, products(nom)")
    .eq("workspace_id", workspaceId)
    .order("cree_le", { ascending: false })
    .limit(limite)
  return data ?? []
}

export type DonneesAjustementStock = {
  type: "entree" | "sortie" | "ajustement"
  quantite: number
  motif?: string | null
}

// Ajuste le niveau, journalise le mouvement puis ré-ouvre/résout l'alerte de
// stock selon le nouveau seuil — même logique que le seed (comparaison à
// seuil_alerte), en attendant la synchronisation FBA automatique.
export async function ajusterStock(
  organizationId: string,
  workspaceId: string,
  productId: string,
  donnees: DonneesAjustementStock
) {
  const supabase = await createClient()

  const { data: niveauActuel } = await supabase
    .from("stock_levels")
    .select("quantite_disponible, seuil_alerte")
    .eq("product_id", productId)
    .maybeSingle()

  const quantiteActuelle = niveauActuel?.quantite_disponible ?? 0
  const seuilAlerte = niveauActuel?.seuil_alerte ?? 10
  const delta = donnees.type === "sortie" ? -donnees.quantite : donnees.quantite
  const nouvelleQuantite =
    donnees.type === "ajustement" ? donnees.quantite : Math.max(0, quantiteActuelle + delta)

  const { error: erreurMouvement } = await supabase.from("stock_movements").insert({
    organization_id: organizationId,
    workspace_id: workspaceId,
    product_id: productId,
    type: donnees.type,
    quantite: donnees.quantite,
    motif: donnees.motif ?? null,
  })
  if (erreurMouvement) throw new Error("Impossible d'enregistrer le mouvement de stock.")

  const { error: erreurNiveau } = await supabase
    .from("stock_levels")
    .upsert(
      { product_id: productId, workspace_id: workspaceId, quantite_disponible: nouvelleQuantite },
      { onConflict: "product_id" }
    )
  if (erreurNiveau) throw new Error("Impossible de mettre à jour le niveau de stock.")

  const statut = statutStock(nouvelleQuantite, seuilAlerte)
  if (statut === "sain") {
    await supabase
      .from("stock_alerts")
      .update({ statut: "resolue" })
      .eq("product_id", productId)
      .eq("statut", "ouverte")
  } else {
    const { data: alerteExistante } = await supabase
      .from("stock_alerts")
      .select("id")
      .eq("product_id", productId)
      .eq("statut", "ouverte")
      .maybeSingle()
    if (!alerteExistante) {
      await supabase.from("stock_alerts").insert({
        product_id: productId,
        workspace_id: workspaceId,
        type: statut,
        statut: "ouverte",
      })
    }
  }
}

export async function mettreAJourSeuilAlerte(productId: string, seuil: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("stock_levels")
    .update({ seuil_alerte: seuil })
    .eq("product_id", productId)
  if (error) throw new Error("Impossible de mettre à jour le seuil d'alerte.")
}
