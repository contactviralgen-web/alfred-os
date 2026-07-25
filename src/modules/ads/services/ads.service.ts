import "server-only"

import { createClient } from "@/lib/supabase/server"
import { enregistrerRecommandation } from "@/modules/agents/services/recommendations.service"
import { LABEL_PLATEFORME, type PlateformePub } from "@/modules/ads/ads.constants"

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
    roasGlobal: depenseTotale > 0 ? Math.round((caGenere / depenseTotale) * 100) / 100 : 0,
    tacosPct: caTotal > 0 ? Math.round((depenseTotale / caTotal) * 10000) / 100 : 0,
  }
}

const SEUIL_ACOS_ALERTE_PCT = 40
const SEUIL_ROAS_OPPORTUNITE = 4

// Agent Pub : détecte les campagnes qui gaspillent du budget (ACOS élevé —
// on dépense plus que ce que la campagne rapporte, relatif au seuil de marge
// courant) et celles à accélérer (ROAS élevé), puis persiste une
// recommandation par campagne signalée. Appelé à la demande (bouton
// "Analyser les campagnes"), pas à chaque chargement de page, pour ne pas
// dupliquer les mêmes recommandations en base.
export async function analyserCampagnes(organizationId: string, workspaceId: string) {
  const campagnes = await listerCampagnes(workspaceId)
  const actives = campagnes.filter((c) => c.statut === "active" && c.depense > 0)

  let creees = 0
  for (const campagne of actives) {
    if (campagne.acosPct > SEUIL_ACOS_ALERTE_PCT) {
      await enregistrerRecommandation(organizationId, workspaceId, {
        agent: "publicite",
        problemeDetecte: `Campagne "${campagne.nom}" (${LABEL_PLATEFORME[campagne.plateforme]}) — ACOS de ${campagne.acosPct.toFixed(0)}%.`,
        analyseIa: `Cette campagne dépense ${campagne.depense.toFixed(0)}€ pour ${campagne.chiffreAffairesGenere.toFixed(0)}€ de chiffre d'affaires généré, un ACOS supérieur au seuil de ${SEUIL_ACOS_ALERTE_PCT}%.`,
        recommandation: `Réduire le budget ou revoir le ciblage de "${campagne.nom}".`,
        impactEstimeEur: campagne.depense - campagne.chiffreAffairesGenere,
      })
      creees++
    } else if (campagne.roas >= SEUIL_ROAS_OPPORTUNITE) {
      await enregistrerRecommandation(organizationId, workspaceId, {
        agent: "publicite",
        problemeDetecte: `Campagne "${campagne.nom}" (${LABEL_PLATEFORME[campagne.plateforme]}) — ROAS de ${campagne.roas.toFixed(1)}.`,
        analyseIa: `Cette campagne génère ${campagne.chiffreAffairesGenere.toFixed(0)}€ pour ${campagne.depense.toFixed(0)}€ dépensés, bien au-dessus du seuil de ${SEUIL_ROAS_OPPORTUNITE}.`,
        recommandation: `Augmenter le budget de "${campagne.nom}" tant que le ROAS se maintient.`,
        impactEstimeEur: campagne.chiffreAffairesGenere - campagne.depense,
      })
      creees++
    }
  }
  return { campagnesAnalysees: actives.length, recommandationsCreees: creees }
}
