import "server-only"

import Anthropic from "@anthropic-ai/sdk"

export const MODELE_IA = "claude-opus-4-8"

export function creerClientIA() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export function estErreurCreditsEpuises(erreur: unknown): boolean {
  return (
    erreur instanceof Anthropic.APIError &&
    erreur.status === 400 &&
    /credit balance/i.test(erreur.message)
  )
}

export function messageErreurIA(erreur: unknown): string {
  if (erreur instanceof Anthropic.APIError) {
    if (estErreurCreditsEpuises(erreur)) {
      return "Le compte Anthropic n'a pas de crédits disponibles. Ajoutez un moyen de paiement sur console.anthropic.com pour activer les fonctionnalités IA."
    }
    if (erreur.status === 401) {
      return "La clé API Anthropic est invalide ou manquante."
    }
    if (erreur.status === 429) {
      return "Trop de requêtes IA en peu de temps. Réessayez dans un instant."
    }
    return `Erreur IA : ${erreur.message}`
  }
  return "Une erreur est survenue lors de l'appel à l'IA."
}
