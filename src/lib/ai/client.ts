import "server-only"

import type { LLMProvider } from "@/lib/ai/provider"
import { AnthropicProvider } from "@/lib/ai/providers/anthropic"

export function obtenirProviderIA(): LLMProvider {
  return new AnthropicProvider()
}
