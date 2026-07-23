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

  const libelleMetrique = metrique === "ca" ? "Chiffre d'affaires" : "Bénéfice net réel"

  const conclusion =
    metrique === "benefice" && total < 0
      ? `Bénéfice net négatif sur la période (${formaterEuros(total)}).`
      : variationPct > 5
        ? `${libelleMetrique} en accélération : ${formaterEuros(total)} (+${variationPct.toFixed(0)}%).`
        : variationPct < -5
          ? `${libelleMetrique} en repli : ${formaterEuros(total)} (${variationPct.toFixed(0)}%).`
          : `${libelleMetrique} stable à ${formaterEuros(total)}.`

  const suggestion =
    metrique === "benefice" && total < 0
      ? "Ouvrez le module Rentabilité pour ajuster les produits qui plombent la marge."
      : variationPct < -5
        ? "Vérifiez les alertes de stock et les commandes bloquées."
        : "Maintenez le rythme et surveillez les alertes de stock."

  return { constat: conclusion, conclusion, suggestion }
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

  for (const alerte of donnees.alertesStock.slice(0, 2)) {
    problemes.push(`${alerte.products?.nom ?? "Un produit"} — ${alerte.type === "rupture" ? "rupture" : "stock bas"}.`)
  }
  for (const commande of donnees.commandesBloquees.slice(0, 1)) {
    problemes.push(`Commande ${commande.numero_commande} bloquée (${formaterEuros(commande.montant_total)}).`)
  }
  for (const produit of donnees.produitsMargeNegative.slice(0, 1)) {
    problemes.push(`"${produit.nom}" déficitaire (${formaterEuros(produit.margeNette)}).`)
  }

  if (donnees.meilleurProduit) {
    opportunites.push(
      `"${donnees.meilleurProduit.nom}" : produit le plus rentable (${donnees.meilleurProduit.margePct.toFixed(0)}%).`
    )
  }
  if (donnees.meilleurFournisseur) {
    opportunites.push(`${donnees.meilleurFournisseur.nom} : fournisseur le plus fiable.`)
  }

  for (const tache of donnees.tachesPrioritaires.slice(0, 2)) {
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

  const conclusion =
    negatifs.length > 0
      ? `${negatifs.length} produit(s) déficitaire(s), dont "${pire.nom}" (${formaterEuros(pire.margeNette)}).`
      : `"${meilleur.nom}" en tête avec ${meilleur.margePct.toFixed(0)}% de marge nette.`

  const suggestion =
    negatifs.length > 0
      ? `Revoyez le prix ou les charges de "${pire.nom}" en priorité.`
      : `Priorisez le réassort sur "${meilleur.nom}".`

  return { constat: conclusion, conclusion, suggestion }
}
