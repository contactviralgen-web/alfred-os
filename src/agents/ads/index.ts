import "server-only"

import { enregistrerRecommandation, remplacerRecommandationsAgent } from "@/modules/agents/services/recommendations.service"
import { listerCampagnes } from "@/connectors/ads/ads.service"
import { LABEL_PLATEFORME } from "@/connectors/ads/ads.constants"

// AGENT 2 — Ads Agent (document). Objectif : "Où gaspille-t-on le budget ?
// Quelles campagnes augmenter ?"
export const objectifAgentPublicite = "Détecter le gaspillage publicitaire et les campagnes à accélérer."
export const sourcesDonneesAgentPublicite = ["advertising_campaigns (Amazon Ads, Meta Ads)"]

const SEUIL_ACOS_ALERTE_PCT = 40
const SEUIL_ROAS_OPPORTUNITE = 4

// Appelé à la demande (bouton "Analyser les campagnes"), pas à chaque
// chargement de page, pour ne pas dupliquer les mêmes recommandations en base.
export async function analyserCampagnes(organizationId: string, workspaceId: string) {
  await remplacerRecommandationsAgent(workspaceId, "publicite")

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
