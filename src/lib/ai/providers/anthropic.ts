import "server-only"

import Anthropic from "@anthropic-ai/sdk"
import type { LLMProvider, LLMRequest } from "@/lib/ai/provider"

const MODEL = "claude-sonnet-5"

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic

  constructor(apiKey: string = process.env.ANTHROPIC_API_KEY!) {
    this.client = new Anthropic({ apiKey })
  }

  async repondre({ system, messages, maxTokens = 1024 }: LLMRequest) {
    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: messages.map(({ role, content }) => ({ role, content })),
    })

    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
  }
}
