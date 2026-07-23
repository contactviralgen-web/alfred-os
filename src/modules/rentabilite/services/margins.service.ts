import "server-only"

import { createClient } from "@/lib/supabase/server"
import { calculerPrixPlancher, type ReglagesCoutsProduit } from "@/modules/rentabilite/services/margins.pure"

export { calculerPrixPlancher }
export type { ReglagesCoutsProduit }

export type ReglagesWorkspace = {
  tauxTvaPct: number
  prixTtc: boolean
}

const REGLAGES_WORKSPACE_DEFAUT: ReglagesWorkspace = { tauxTvaPct: 20, prixTtc: true }

export async function obtenirReglagesWorkspace(workspaceId: string): Promise<ReglagesWorkspace> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("workspace_cost_settings")
    .select("taux_tva_pct, prix_ttc")
    .eq("workspace_id", workspaceId)
    .maybeSingle()

  if (!data) return REGLAGES_WORKSPACE_DEFAUT
  return { tauxTvaPct: Number(data.taux_tva_pct), prixTtc: data.prix_ttc }
}

export async function mettreAJourReglagesWorkspace(
  organizationId: string,
  workspaceId: string,
  donnees: ReglagesWorkspace
) {
  const supabase = await createClient()
  const { error } = await supabase.from("workspace_cost_settings").upsert(
    {
      organization_id: organizationId,
      workspace_id: workspaceId,
      taux_tva_pct: donnees.tauxTvaPct,
      prix_ttc: donnees.prixTtc,
    },
    { onConflict: "workspace_id" }
  )
  if (error) throw new Error("Impossible de mettre à jour les réglages de TVA.")
}

export async function obtenirReglagesCoutsProduits(
  workspaceId: string
): Promise<ReglagesCoutsProduit[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select(
      "id, sku, nom, categorie, prix_achat, prix_vente, product_cost_settings(cout_transport_flat, cout_douane_flat, frais_amazon_pct, frais_fba_flat, frais_stockage_unitaire_flat, taux_retour_pct, cout_divers_flat, marge_plancher_pct)"
    )
    .eq("workspace_id", workspaceId)
    .eq("actif", true)
    .order("nom")

  return (data ?? []).map((p) => {
    const couts = Array.isArray(p.product_cost_settings)
      ? p.product_cost_settings[0]
      : p.product_cost_settings
    return {
      productId: p.id,
      sku: p.sku,
      nom: p.nom,
      categorie: p.categorie,
      prixAchat: Number(p.prix_achat),
      prixVente: Number(p.prix_vente),
      coutTransportFlat: Number(couts?.cout_transport_flat ?? 0),
      coutDouaneFlat: Number(couts?.cout_douane_flat ?? 0),
      fraisAmazonPct: Number(couts?.frais_amazon_pct ?? 15),
      fraisFbaFlat: Number(couts?.frais_fba_flat ?? 0),
      fraisStockageUnitaireFlat: Number(couts?.frais_stockage_unitaire_flat ?? 0),
      tauxRetourPct: Number(couts?.taux_retour_pct ?? 0),
      coutDiversFlat: Number(couts?.cout_divers_flat ?? 0),
      margePlancherPct: Number(couts?.marge_plancher_pct ?? 15),
    }
  })
}

export async function mettreAJourCoutsProduit(
  organizationId: string,
  workspaceId: string,
  productId: string,
  donnees: Omit<
    ReglagesCoutsProduit,
    "productId" | "sku" | "nom" | "categorie" | "prixAchat" | "prixVente"
  >
) {
  const supabase = await createClient()
  const { error } = await supabase.from("product_cost_settings").upsert(
    {
      organization_id: organizationId,
      workspace_id: workspaceId,
      product_id: productId,
      cout_transport_flat: donnees.coutTransportFlat,
      cout_douane_flat: donnees.coutDouaneFlat,
      frais_amazon_pct: donnees.fraisAmazonPct,
      frais_fba_flat: donnees.fraisFbaFlat,
      frais_stockage_unitaire_flat: donnees.fraisStockageUnitaireFlat,
      taux_retour_pct: donnees.tauxRetourPct,
      cout_divers_flat: donnees.coutDiversFlat,
      marge_plancher_pct: donnees.margePlancherPct,
    },
    { onConflict: "product_id" }
  )
  if (error) throw new Error("Impossible de mettre à jour les charges du produit.")
}

type LigneVProductMargins = {
  chiffre_affaires: number
  quantite: number
  cout_transport_flat: number
  cout_douane_flat: number
  frais_amazon_pct: number
  frais_fba_flat: number
  frais_stockage_unitaire_flat: number
  taux_retour_pct: number
  cout_divers_flat: number
  taux_tva_pct: number
  prix_achat: number
}

// Marge nette = CA - coût fournisseur - charges récurrentes par unité - TVA
// (déduite du prix TTC). Fonction pure, réutilisable en tests.
export function calculerMargeLigne(ligne: LigneVProductMargins) {
  const tva = (ligne.chiffre_affaires / (1 + ligne.taux_tva_pct / 100)) * (ligne.taux_tva_pct / 100)
  const chargesUnitaires =
    (ligne.prix_achat +
      ligne.cout_transport_flat +
      ligne.cout_douane_flat +
      ligne.frais_fba_flat +
      ligne.frais_stockage_unitaire_flat +
      ligne.cout_divers_flat) *
    ligne.quantite
  const chargesProportionnelles =
    ligne.chiffre_affaires * ((ligne.frais_amazon_pct + ligne.taux_retour_pct) / 100)
  const chargesTotal = chargesUnitaires + chargesProportionnelles + tva
  const margeNette = ligne.chiffre_affaires - chargesTotal
  const margePct = ligne.chiffre_affaires > 0 ? (margeNette / ligne.chiffre_affaires) * 100 : 0
  return { chargesTotal, tva, margeNette, margePct }
}

type Periode = { debut: string; fin: string }

type LigneMargeNormalisee = LigneVProductMargins & {
  product_id: string
  produit_nom: string
  categorie: string | null
  cree_le: string
}

export async function obtenirLignesMarges(
  workspaceId: string,
  periode: Periode,
  canal?: "site_web" | "amazon" | "manuel"
): Promise<LigneMargeNormalisee[]> {
  const supabase = await createClient()
  let requete = supabase
    .from("v_product_margins")
    .select("*")
    .eq("workspace_id", workspaceId)
    .neq("statut", "annulee")
    .gte("cree_le", periode.debut)
    .lt("cree_le", periode.fin)
  if (canal) requete = requete.eq("canal", canal)
  const { data } = await requete

  return (data ?? [])
    .filter((ligne) => ligne.product_id !== null && ligne.cree_le !== null)
    .map((ligne) => ({
      ...ligne,
      product_id: ligne.product_id!,
      produit_nom: ligne.produit_nom ?? "",
      categorie: ligne.categorie,
      cree_le: ligne.cree_le!,
      chiffre_affaires: Number(ligne.chiffre_affaires ?? 0),
      quantite: Number(ligne.quantite ?? 0),
      cout_transport_flat: Number(ligne.cout_transport_flat ?? 0),
      cout_douane_flat: Number(ligne.cout_douane_flat ?? 0),
      frais_amazon_pct: Number(ligne.frais_amazon_pct ?? 15),
      frais_fba_flat: Number(ligne.frais_fba_flat ?? 0),
      frais_stockage_unitaire_flat: Number(ligne.frais_stockage_unitaire_flat ?? 0),
      taux_retour_pct: Number(ligne.taux_retour_pct ?? 0),
      cout_divers_flat: Number(ligne.cout_divers_flat ?? 0),
      taux_tva_pct: Number(ligne.taux_tva_pct ?? 20),
      prix_achat: Number(ligne.prix_achat ?? 0),
    }))
}

export async function obtenirMargesParProduit(workspaceId: string, periode: Periode) {
  const lignes = await obtenirLignesMarges(workspaceId, periode)
  const parProduit = new Map<
    string,
    { productId: string; nom: string; categorie: string | null; chiffreAffaires: number; margeNette: number; unitesVendues: number }
  >()

  for (const ligne of lignes) {
    const { margeNette } = calculerMargeLigne(ligne)
    const existant = parProduit.get(ligne.product_id!) ?? {
      productId: ligne.product_id!,
      nom: ligne.produit_nom!,
      categorie: ligne.categorie,
      chiffreAffaires: 0,
      margeNette: 0,
      unitesVendues: 0,
    }
    existant.chiffreAffaires += Number(ligne.chiffre_affaires)
    existant.margeNette += margeNette
    existant.unitesVendues += ligne.quantite ?? 0
    parProduit.set(ligne.product_id!, existant)
  }

  return Array.from(parProduit.values())
    .map((p) => ({ ...p, margePct: p.chiffreAffaires > 0 ? (p.margeNette / p.chiffreAffaires) * 100 : 0 }))
    .sort((a, b) => b.margeNette - a.margeNette)
}

export async function obtenirMargesParCategorie(workspaceId: string, periode: Periode) {
  const lignes = await obtenirLignesMarges(workspaceId, periode)
  const parCategorie = new Map<string, { categorie: string; chiffreAffaires: number; margeNette: number }>()

  for (const ligne of lignes) {
    const { margeNette } = calculerMargeLigne(ligne)
    const cle = ligne.categorie ?? "Sans catégorie"
    const existant = parCategorie.get(cle) ?? { categorie: cle, chiffreAffaires: 0, margeNette: 0 }
    existant.chiffreAffaires += Number(ligne.chiffre_affaires)
    existant.margeNette += margeNette
    parCategorie.set(cle, existant)
  }

  return Array.from(parCategorie.values())
    .map((c) => ({ ...c, margePct: c.chiffreAffaires > 0 ? (c.margeNette / c.chiffreAffaires) * 100 : 0 }))
    .sort((a, b) => b.margeNette - a.margeNette)
}

export type PointEvolutionMarge = { date: string; chiffreAffaires: number; margeNette: number }

function bucketDate(dateIso: string, granularite: "jour" | "semaine" | "mois"): string {
  const date = new Date(dateIso)
  if (granularite === "jour") return date.toISOString().slice(0, 10)
  if (granularite === "mois") return date.toISOString().slice(0, 7)
  const debutSemaine = new Date(date)
  debutSemaine.setUTCDate(date.getUTCDate() - date.getUTCDay())
  return debutSemaine.toISOString().slice(0, 10)
}

export async function obtenirEvolutionMarge(
  workspaceId: string,
  granularite: "jour" | "semaine" | "mois",
  periode: Periode
): Promise<PointEvolutionMarge[]> {
  const lignes = await obtenirLignesMarges(workspaceId, periode)
  const parBucket = new Map<string, { chiffreAffaires: number; margeNette: number }>()

  for (const ligne of lignes) {
    const { margeNette } = calculerMargeLigne(ligne)
    const cle = bucketDate(ligne.cree_le!, granularite)
    const existant = parBucket.get(cle) ?? { chiffreAffaires: 0, margeNette: 0 }
    existant.chiffreAffaires += Number(ligne.chiffre_affaires)
    existant.margeNette += margeNette
    parBucket.set(cle, existant)
  }

  return Array.from(parBucket.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function obtenirBeneficeTotalPeriode(
  workspaceId: string,
  periode: Periode,
  canal?: "site_web" | "amazon" | "manuel"
) {
  const lignes = await obtenirLignesMarges(workspaceId, periode, canal)
  let chiffreAffaires = 0
  let margeNette = 0
  for (const ligne of lignes) {
    chiffreAffaires += Number(ligne.chiffre_affaires)
    margeNette += calculerMargeLigne(ligne).margeNette
  }
  return { chiffreAffaires, margeNette }
}
