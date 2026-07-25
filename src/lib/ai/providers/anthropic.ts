import "server-only"

import Anthropic from "@anthropic-ai/sdk"

import type { LLMProvider, MessageLLM, ResultatLLM } from "@/lib/ai/provider"

const MODELE_IA = "claude-opus-4-8"

function estErreurCreditsEpuises(erreur: unknown): boolean {
  return (
    erreur instanceof Anthropic.APIError &&
    erreur.status === 400 &&
    /credit balance/i.test(erreur.message)
  )
}

function messageErreurIA(erreur: unknown): string {
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

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  async repondre({
    system,
    messages,
    maxTokens = 1536,
  }: {
    system: string
    messages: MessageLLM[]
    maxTokens?: number
  }): Promise<ResultatLLM> {
    try {
      const response = await this.client.messages.create({
        model: MODELE_IA,
        max_tokens: maxTokens,
        thinking: { type: "adaptive" },
        system,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      })

      const texte = response.content.find((b) => b.type === "text")
      if (response.stop_reason === "refusal" || !texte) {
        return {
          succes: false,
          erreurCreditsEpuises: false,
          message: "Le Directeur IA n'a pas pu répondre à cette question.",
        }
      }

      return { succes: true, reponse: texte.text }
    } catch (erreur) {
      return {
        succes: false,
        erreurCreditsEpuises: estErreurCreditsEpuises(erreur),
        message: messageErreurIA(erreur),
      }
    }
  }
}
