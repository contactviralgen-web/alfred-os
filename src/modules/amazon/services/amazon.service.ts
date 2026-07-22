import "server-only"

import { createClient } from "@/lib/supabase/server"
import { obtenirBeneficeTotalPeriode } from "@/modules/rentabilite/services/margins.service"

export type ConnexionAmazon = {
  statut: "connecte" | "deconnecte"
  sellerId: string | null
  marketplaces: string[]
  connecteLe: string | null
}

const CONNEXION_PAR_DEFAUT: ConnexionAmazon = {
  statut: "deconnecte",
  sellerId: null,
  marketplaces: [],
  connecteLe: null,
}

export async function obtenirConnexion(workspaceId: string): Promise<ConnexionAmazon> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("amazon_connections")
    .select("statut, seller_id, marketplaces, connecte_le")
    .eq("workspace_id", workspaceId)
    .maybeSingle()

  if (!data) return CONNEXION_PAR_DEFAUT
  return {
    statut: data.statut,
    sellerId: data.seller_id,
    marketplaces: data.marketplaces,
    connecteLe: data.connecte_le,
  }
}

function genererSellerIdFictif() {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from({ length: 13 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join("")
}

// Simule la connexion SP-API : aucun appel réseau réel, juste un état stocké
// avec des valeurs fictives — même mécanique que la stratégie démo-first du
// reste du projet. Basculer vers le vrai OAuth Amazon plus tard ne changera
// que le contenu de cette fonction, pas l'UI qui la consomme.
export async function connecterAmazon(organizationId: string, workspaceId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("amazon_connections").upsert(
    {
      organization_id: organizationId,
      workspace_id: workspaceId,
      statut: "connecte",
      seller_id: genererSellerIdFictif(),
      marketplaces: ["FR", "DE"],
      connecte_le: new Date().toISOString(),
    },
    { onConflict: "workspace_id" }
  )
  if (error) throw new Error("Impossible de connecter le compte Amazon.")
}

export async function deconnecterAmazon(workspaceId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("amazon_connections")
    .update({ statut: "deconnecte" })
    .eq("workspace_id", workspaceId)
  if (error) throw new Error("Impossible de déconnecter le compte Amazon.")
}

export type IndicateursCompteAmazon = {
  tauxAnnulation: number
  tauxRetour: number
  delaiExpeditionMoyenHeures: number
  scoreSante: number
}

// Account Health : combine des taux réels (annulation, retours) calculés sur
// les vraies données de l'organisation avec un délai d'expédition simulé
// (Amazon calcule ce délai à partir de la confirmation d'expédition réelle,
// non disponible sans connexion FBA réelle).
export async function obtenirIndicateursCompte(workspaceId: string): Promise<IndicateursCompteAmazon> {
  const supabase = await createClient()
  const debut = new Date(Date.now() - 30 * 86400000).toISOString()

  const [{ data: commandes }, { data: retours }] = await Promise.all([
    supabase
      .from("orders")
      .select("statut")
      .eq("workspace_id", workspaceId)
      .eq("canal", "amazon")
      .gte("cree_le", debut),
    supabase
      .from("product_returns")
      .select("quantite")
      .eq("workspace_id", workspaceId)
      .gte("cree_le", debut),
  ])

  const totalCommandes = commandes?.length ?? 0
  const annulees = commandes?.filter((c) => c.statut === "annulee").length ?? 0
  const tauxAnnulation = totalCommandes > 0 ? (annulees / totalCommandes) * 100 : 0

  const totalRetours = (retours ?? []).reduce((s, r) => s + r.quantite, 0)
  const tauxRetour = totalCommandes > 0 ? (totalRetours / totalCommandes) * 100 : 0

  const delaiExpeditionMoyenHeures = 14 // simulé : nécessite la confirmation d'expédition Amazon réelle
  const scoreSante = Math.max(0, Math.round(100 - tauxAnnulation * 2 - tauxRetour * 1.5))

  return { tauxAnnulation, tauxRetour, delaiExpeditionMoyenHeures, scoreSante }
}

export async function obtenirVentesAmazon(workspaceId: string, periode: { debut: string; fin: string }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("orders")
    .select("montant_total")
    .eq("workspace_id", workspaceId)
    .eq("canal", "amazon")
    .neq("statut", "annulee")
    .gte("cree_le", periode.debut)
    .lt("cree_le", periode.fin)

  const ca = (data ?? []).reduce((s, o) => s + Number(o.montant_total), 0)
  const commandes = data?.length ?? 0
  const { margeNette: benefice } = await obtenirBeneficeTotalPeriode(workspaceId, periode, "amazon")

  return { ca, benefice, commandes }
}

const LABEL_MOTIF: Record<string, string> = {
  defectueux: "Produit défectueux",
  ne_correspond_pas: "Ne correspond pas à la description",
  taille_couleur: "Taille/couleur incorrecte",
  change_avis: "A changé d'avis",
  autre: "Autre",
}

export async function listerRetours(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("product_returns")
    .select("id, quantite, motif, cree_le, products(nom)")
    .eq("workspace_id", workspaceId)
    .order("cree_le", { ascending: false })
    .limit(15)
  return data ?? []
}

export async function obtenirMotifsFrequents(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("product_returns")
    .select("motif, quantite")
    .eq("workspace_id", workspaceId)

  const parMotif = new Map<string, number>()
  for (const r of data ?? []) {
    parMotif.set(r.motif, (parMotif.get(r.motif) ?? 0) + r.quantite)
  }
  return Array.from(parMotif.entries())
    .map(([motif, quantite]) => ({ motif, libelle: LABEL_MOTIF[motif] ?? motif, quantite }))
    .sort((a, b) => b.quantite - a.quantite)
}

export type MotifRetour = "defectueux" | "ne_correspond_pas" | "taille_couleur" | "change_avis" | "autre"

export async function ajouterRetour(
  organizationId: string,
  workspaceId: string,
  donnees: { productId: string; quantite: number; motif: MotifRetour }
) {
  const supabase = await createClient()
  const { error } = await supabase.from("product_returns").insert({
    organization_id: organizationId,
    workspace_id: workspaceId,
    product_id: donnees.productId,
    quantite: donnees.quantite,
    motif: donnees.motif,
  })
  if (error) throw new Error("Impossible d'enregistrer le retour.")
}
