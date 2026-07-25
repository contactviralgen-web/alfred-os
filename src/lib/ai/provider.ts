import "server-only"

// Interface d'abstraction fournisseur LLM (principe 3 du prompt "Amazon
// Profit Intelligence" : ne jamais dépendre d'un seul fournisseur). Un seul
// provider concret existe pour l'instant (Anthropic, voir providers/
// anthropic.ts) mais la logique métier (directeur.service.ts) ne dépend plus
// que de cette interface, pas du SDK Anthropic.

export type MessageLLM = { role: "user" | "assistant"; content: string }

export type ResultatLLM =
  | { succes: true; reponse: string }
  | { succes: false; erreurCreditsEpuises: boolean; message: string }

export interface LLMProvider {
  repondre(params: { system: string; messages: MessageLLM[]; maxTokens?: number }): Promise<ResultatLLM>
}
