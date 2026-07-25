import "server-only"

export type LLMMessage = {
  role: "user" | "assistant"
  content: string
}

export type LLMRequest = {
  system?: string
  messages: LLMMessage[]
  maxTokens?: number
}

export interface LLMProvider {
  repondre(request: LLMRequest): Promise<string>
}
