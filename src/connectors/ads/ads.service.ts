import "server-only"

import { createClient } from "@/lib/supabase/server"
import { LABEL_PLATEFORME, type PlateformePub } from "@/connectors/ads/ads.constants"
import { calculerRoas, calculerTacosPct } from "@/engine/metrics"

export type ConnexionPub = {
  plateforme: PlateformePub
  statut: "connecte" | "deconnecte"
  compteId: string | null
  connecteLe: string | null
}

export async function obtenirConnexionsPub(workspaceId: string): Promise<ConnexionPub[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("ads_connections")
    .select("plateforme, statut, compte_id, connecte_le")
    .eq("workspace_id", workspaceId)

  const parPlateforme = new Map((data ?? []).map((c) => [c.plateforme, c]))
  return (["amazon_ads", "meta_ads"] as const).map((plateforme) => {
    const existant = parPlateforme.get(plateforme)
    return {
      plateforme,
      statut: existant?.statut ?? "deconnecte",
      compteId: existant?.compte_id ?? null,
      connecteLe: existant?.connecte_le ?? null,
    }
  })
}

function genererCompteIdFictif(plateforme: PlateformePub) {
  const prefixe = plateforme === "amazon_ads" ? "ADV" : "ACT"
  const caracteres = "0123456789"
  return `${prefixe}-${Array.from({ length: 10 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join("")}`
}

// Simule l'OAuth Amazon Advertising / Meta Ads : même mécanique démo-first
// que connecterAmazon (amazon.service.ts) — aucun appel réseau réel.
export async function connecterPlateformePub(
  organizationId: string,
  workspaceId: string,
  plateforme: PlateformePub
) {
  const supabase = await createClient()
  const { error } = await supabase.from("ads_connections").upsert(
    {
      organization_id: organizationId,
      workspace_id: workspaceId,
      plateforme,
      statut: "connecte",
      compte_id: genererCompteIdFictif(plateforme),
      connecte_le: new Date().toISOString(),
    },
    { onConflict: "workspace_id,plateforme" }
  )
  if (error) throw new Error(`Impossible de connecter ${LABEL_PLATEFORME[plateforme]}.`)
}

export async function deconnecterPlateformePub(workspaceId: string, plateforme: PlateformePub) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("ads_connections")
    .update({ statut: "deconnecte" })
    .eq("workspace_id", workspaceId)
    .eq("plateforme", plateforme)
  if (error) throw new Error(`Impossible de déconnecter ${LABEL_PLATEFORME[plateforme]}.`)
}

export type Campagne = {
  id: string
  plateforme: PlateformePub
  nom: string
  statut: "active" | "en_pause" | "terminee"
  depense: number
  impressions: number
  clics: number
  conversions: number
  chiffreAffairesGenere: number
  roas: number
  acosPct: number
}

export async function listerCampagnes(workspaceId: string): Promise<Campagne[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("v_ad_performance")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("depense", { ascending: false })

  return (data ?? []).map((c) => ({
    id: c.id!,
    plateforme: c.plateforme!,
    nom: c.nom!,
    statut: c.statut!,
    depense: Number(c.depense),
    impressions: c.impressions ?? 0,
    clics: c.clics ?? 0,
    conversions: c.conversions ?? 0,
    chiffreAffairesGenere: Number(c.chiffre_affaires_genere),
    roas: Number(c.roas),
    acosPct: Number(c.acos_pct),
  }))
}

export type KpisPub = {
  depenseTotale: number
  caGenere: number
  roasGlobal: number
  tacosPct: number
}

// TACOS = dépense pub totale / CA total du workspace (tous canaux, pas
// seulement les ventes attribuées aux campagnes) — c'est ce qui le distingue
// de l'ACOS par campagne, cf. définition du document produit.
export async function obtenirKpisPub(
  workspaceId: string,
  periode: { debut: string; fin: string }
): Promise<KpisPub> {
  const supabase = await createClient()
  const [{ data: campagnes }, { data: commandes }] = await Promise.all([
    supabase
      .from("advertising_campaigns")
      .select("depense, chiffre_affaires_genere")
      .eq("workspace_id", workspaceId)
      .gte("cree_le", periode.debut)
      .lt("cree_le", periode.fin),
    supabase
      .from("orders")
      .select("montant_total")
      .eq("workspace_id", workspaceId)
      .neq("statut", "annulee")
      .gte("cree_le", periode.debut)
      .lt("cree_le", periode.fin),
  ])

  const depenseTotale = (campagnes ?? []).reduce((s, c) => s + Number(c.depense), 0)
  const caGenere = (campagnes ?? []).reduce((s, c) => s + Number(c.chiffre_affaires_genere), 0)
  const caTotal = (commandes ?? []).reduce((s, o) => s + Number(o.montant_total), 0)

  return {
    depenseTotale,
    caGenere,
    roasGlobal: calculerRoas(caGenere, depenseTotale),
    tacosPct: calculerTacosPct(depenseTotale, caTotal),
  }
}
