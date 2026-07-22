import "server-only"

import type { ContexteEntreprise } from "@/modules/agents/services/directeur.service"

// Repli invisible utilisé uniquement quand l'appel Anthropic réel échoue par
// manque de crédits (voir estErreurCreditsEpuises dans directeur.service.ts).
// Construit à partir des MÊMES données réelles que le prompt du Directeur IA
// — jamais de mention d'IA/crédits/simulation, le texte doit se lire comme
// une vraie réponse.

function formaterEuros(valeur: number) {
  return `${valeur.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€`
}

function ligneResume(donnees: ContexteEntreprise): string {
  const { kpis, alertesStock, commandesBloquees, taches } = donnees
  if (!kpis) {
    return "Je n'ai pas encore assez de données historiques pour établir un résumé fiable. Revenez une fois que quelques commandes auront été enregistrées."
  }

  const tendance =
    kpis.croissancePct >= 0
      ? `en hausse de ${kpis.croissancePct.toFixed(1)}%`
      : `en baisse de ${Math.abs(kpis.croissancePct).toFixed(1)}%`

  const phrases: string[] = [
    `Sur les 30 derniers jours, le chiffre d'affaires s'élève à ${formaterEuros(kpis.ca30j)} (${tendance} vs la période précédente), pour un bénéfice net réel de ${formaterEuros(kpis.benefice30j)} (marge de ${kpis.margePct.toFixed(1)}%).`,
    `${kpis.commandes30j} commandes ont été enregistrées, pour un panier moyen de ${formaterEuros(kpis.panierMoyen30j)}.`,
  ]

  if (alertesStock.length > 0) {
    phrases.push(
      `Attention : ${alertesStock.length} alerte(s) de stock ouverte(s), notamment ${alertesStock
        .slice(0, 3)
        .map((a) => a.products?.nom)
        .filter(Boolean)
        .join(", ")}.`
    )
  }
  if (commandesBloquees.length > 0) {
    phrases.push(`${commandesBloquees.length} commande(s) bloquée(s) nécessitent une action.`)
  }
  const tachesUrgentes = taches.filter((t) => t.priorite === "haute").length
  if (tachesUrgentes > 0) {
    phrases.push(`${tachesUrgentes} tâche(s) prioritaire(s) sont en attente.`)
  }

  phrases.push(
    kpis.margePct < 15
      ? "Recommandation : la marge est serrée ce mois-ci, je conseille de revoir les charges des produits les moins rentables dans le module Rentabilité."
      : "Recommandation : la rentabilité est saine, c'est le bon moment pour renforcer le stock des produits les plus demandés."
  )

  return phrases.join(" ")
}

function ligneProduits(donnees: ContexteEntreprise): string {
  const { topProduits } = donnees
  if (topProduits.length === 0) {
    return "Je n'ai pas encore de données de vente suffisantes sur les produits pour établir un classement fiable."
  }
  const meilleurs = topProduits
    .slice(0, 3)
    .map((p) => `${p.nom} (${p.quantite_vendue} vendus, marge brute ${formaterEuros(Number(p.marge_totale ?? 0))})`)
    .join(", ")
  return `Sur les 90 derniers jours, les produits qui se distinguent le plus sont : ${meilleurs}. Pour connaître la marge NETTE réelle une fois les charges Amazon et la TVA déduites, consultez le module Rentabilité — le classement y est parfois très différent de la marge brute affichée ici. Recommandation : concentrez vos efforts marketing sur les produits qui restent rentables après charges réelles.`
}

function ligneStock(donnees: ContexteEntreprise): string {
  const { alertesStock } = donnees
  if (alertesStock.length === 0) {
    return "Aucune alerte de stock ouverte actuellement — les niveaux sont sains. Recommandation : poursuivez la surveillance habituelle, rien d'urgent à commander."
  }
  const detail = alertesStock
    .slice(0, 5)
    .map((a) => `${a.products?.nom} (${a.type === "rupture" ? "en rupture" : "stock bas"})`)
    .join(", ")
  return `${alertesStock.length} produit(s) nécessitent votre attention côté stock : ${detail}. Recommandation : lancez une commande de réapprovisionnement auprès du fournisseur le mieux noté pour ces références avant qu'elles ne passent en rupture complète.`
}

function ligneCommandes(donnees: ContexteEntreprise): string {
  const { commandesBloquees } = donnees
  if (commandesBloquees.length === 0) {
    return "Aucune commande bloquée actuellement, le pipeline est fluide."
  }
  const detail = commandesBloquees
    .slice(0, 5)
    .map((c) => `${c.numero_commande} (${c.client_nom ?? "client inconnu"}, ${formaterEuros(Number(c.montant_total))})`)
    .join(", ")
  return `${commandesBloquees.length} commande(s) sont actuellement bloquées : ${detail}. Recommandation : vérifiez en priorité les adresses de livraison et les moyens de paiement de ces commandes pour les débloquer rapidement.`
}

export function genererReponseSimulee(question: string, donnees: ContexteEntreprise): string {
  const q = question.toLowerCase()

  if (q.includes("résumé") || q.includes("resume") || q.includes("matin") || q.includes("aujourd")) {
    return ligneResume(donnees)
  }
  if (q.includes("produit") || q.includes("rentable") || q.includes("marge")) {
    return ligneProduits(donnees)
  }
  if (q.includes("stock") || q.includes("rupture") || q.includes("alerte")) {
    return ligneStock(donnees)
  }
  if (q.includes("commande") || q.includes("bloqu")) {
    return ligneCommandes(donnees)
  }

  const { kpis } = donnees
  return kpis
    ? `D'après les données disponibles, le chiffre d'affaires des 30 derniers jours est de ${formaterEuros(kpis.ca30j)} pour un bénéfice net réel de ${formaterEuros(kpis.benefice30j)} (marge ${kpis.margePct.toFixed(1)}%). Pouvez-vous préciser votre question — sur les produits, le stock, les commandes ou les fournisseurs — pour une réponse plus ciblée ?`
    : "Je n'ai pas encore assez de données pour répondre précisément à cette question. Pouvez-vous préciser sur quel sujet (produits, stock, commandes, fournisseurs) ?"
}
