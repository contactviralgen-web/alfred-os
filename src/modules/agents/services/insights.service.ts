import "server-only"

import type { PointGraphique, MetriqueGraphique } from "@/modules/dashboard/services/revenue-chart.service"

// Interprétation IA sous les graphiques : déterministe/templatée pour la
// démo, mais avec la même forme de sortie qu'aurait un vrai appel Anthropic —
// remplacer l'implémentation par un appel réel plus tard ne change ni la
// signature, ni les composants qui l'affichent.
export type InsightIA = { constat: string; conclusion: string; suggestion: string }

function formaterEuros(valeur: number) {
  return `${Math.round(valeur).toLocaleString("fr-FR")}€`
}

export function genererInsightRevenu(points: PointGraphique[], metrique: MetriqueGraphique): InsightIA {
  const valeurs = points.map((p) => p.valeur)
  if (valeurs.length === 0 || valeurs.every((v) => v === 0)) {
    return {
      constat: "Pas encore assez de données sur cette période pour dégager une tendance.",
      conclusion: "L'historique est trop court ou vide.",
      suggestion: "Élargissez la période ou revenez une fois plus de commandes enregistrées.",
    }
  }

  const total = valeurs.reduce((s, v) => s + v, 0)
  const moitie = Math.floor(valeurs.length / 2)
  const debut = valeurs.slice(0, moitie).reduce((s, v) => s + v, 0) || 1
  const fin = valeurs.slice(moitie).reduce((s, v) => s + v, 0)
  const variationPct = ((fin - debut) / debut) * 100

  const indexPic = valeurs.indexOf(Math.max(...valeurs))
  const pic = points[indexPic]
  const libelleMetrique = metrique === "ca" ? "chiffre d'affaires" : "bénéfice net réel"

  const tendance =
    variationPct > 5
      ? `en accélération (+${variationPct.toFixed(0)}% en deuxième moitié de période)`
      : variationPct < -5
        ? `en ralentissement (${variationPct.toFixed(0)}% en deuxième moitié de période)`
        : "globalement stable"

  const constat = `Sur la période, le ${libelleMetrique} total est de ${formaterEuros(total)}, ${tendance}. Le point le plus haut est le ${pic.libelle} (${formaterEuros(pic.valeur)}).`

  const conclusion =
    metrique === "benefice" && total < 0
      ? "La rentabilité réelle est négative sur cette période une fois les charges déduites — l'activité vend, mais ne dégage pas de marge nette pour l'instant."
      : variationPct > 5
        ? "La dynamique est positive, la croissance s'accélère en fin de période."
        : variationPct < -5
          ? "Le repli en fin de période mérite une vérification (rupture de stock, baisse de trafic, saisonnalité)."
          : "L'activité est régulière sans signal d'alerte particulier."

  const suggestion =
    metrique === "benefice" && total < 0
      ? "Ouvrez le module Rentabilité pour identifier les produits qui plombent la marge et ajuster leurs charges ou leur prix."
      : variationPct < -5
        ? "Vérifiez les alertes de stock et les commandes bloquées : elles expliquent souvent un repli de courte durée."
        : "Maintenez le rythme actuel et surveillez les alertes de stock pour ne pas casser la dynamique."

  return { constat, conclusion, suggestion }
}

export function construireCentreDecisions(donnees: {
  alertesStock: { type: string; products?: { nom: string } | null }[]
  commandesBloquees: { numero_commande: string; montant_total: number }[]
  produitsMargeNegative: { nom: string; margeNette: number }[]
  meilleurProduit: { nom: string; margePct: number } | null
  meilleurFournisseur: { nom: string } | null
  tachesPrioritaires: { titre: string }[]
}): { problemes: string[]; opportunites: string[]; actions: string[] } {
  const problemes: string[] = []
  const opportunites: string[] = []
  const actions: string[] = []

  for (const alerte of donnees.alertesStock.slice(0, 3)) {
    problemes.push(
      `${alerte.products?.nom ?? "Un produit"} est ${alerte.type === "rupture" ? "en rupture de stock" : "en stock bas"}.`
    )
  }
  for (const commande of donnees.commandesBloquees.slice(0, 2)) {
    problemes.push(
      `Commande ${commande.numero_commande} bloquée (${formaterEuros(commande.montant_total)}) — nécessite une action.`
    )
  }
  for (const produit of donnees.produitsMargeNegative.slice(0, 2)) {
    problemes.push(
      `"${produit.nom}" est déficitaire (${formaterEuros(produit.margeNette)}) une fois les charges réelles comptées.`
    )
  }

  if (donnees.meilleurProduit) {
    opportunites.push(
      `"${donnees.meilleurProduit.nom}" est votre produit le plus rentable actuellement (${donnees.meilleurProduit.margePct.toFixed(0)}% de marge nette).`
    )
  }
  if (donnees.meilleurFournisseur) {
    opportunites.push(
      `${donnees.meilleurFournisseur.nom} est le fournisseur le plus fiable en ce moment — à privilégier pour vos prochaines commandes.`
    )
  }

  for (const tache of donnees.tachesPrioritaires.slice(0, 3)) {
    actions.push(tache.titre)
  }

  return { problemes, opportunites, actions }
}

export function genererInsightMarge(
  margesParProduit: { nom: string; margeNette: number; margePct: number }[]
): InsightIA {
  if (margesParProduit.length === 0) {
    return {
      constat: "Aucune vente enregistrée sur cette période pour calculer une marge.",
      conclusion: "Impossible de comparer les produits pour l'instant.",
      suggestion: "Configurez les charges de vos produits puis revenez une fois des commandes passées.",
    }
  }

  const meilleur = margesParProduit[0]
  const pire = margesParProduit[margesParProduit.length - 1]
  const negatifs = margesParProduit.filter((p) => p.margeNette < 0)

  const constat = `"${meilleur.nom}" dégage la meilleure marge nette réelle (${formaterEuros(meilleur.margeNette)}, ${meilleur.margePct.toFixed(0)}%)${
    negatifs.length > 0
      ? `, tandis que ${negatifs.length} produit(s) sont déficitaires une fois les charges réelles comptées, dont "${pire.nom}" (${formaterEuros(pire.margeNette)}).`
      : "."
  }`

  const conclusion =
    negatifs.length > 0
      ? "Certains produits qui semblent bien se vendre coûtent en réalité plus cher qu'ils ne rapportent (frais Amazon, transport, retours)."
      : "L'ensemble du catalogue reste rentable une fois les charges réelles déduites."

  const suggestion =
    negatifs.length > 0
      ? `Revoyez le prix de vente ou les charges de "${pire.nom}" en priorité, ou envisagez d'arrêter ce produit s'il reste déficitaire.`
      : `Concentrez le budget publicitaire et le réassort sur "${meilleur.nom}", votre produit le plus rentable actuellement.`

  return { constat, conclusion, suggestion }
}
