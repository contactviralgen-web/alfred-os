import "server-only"

import { AnthropicProvider } from "@/lib/ai/providers/anthropic"
import type { LLMProvider } from "@/lib/ai/provider"

let provider: LLMProvider | null = null

export function obtenirProviderIA(): LLMProvider {
  if (!provider) {
    provider = new AnthropicProvider()
  }
  return provider
}

export type { LLMProvider, LLMMessage, LLMRequest } from "@/lib/ai/provider"
