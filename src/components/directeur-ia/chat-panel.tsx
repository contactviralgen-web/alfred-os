"use client"

import { useState } from "react"
import { ArrowUp, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/lib/demo/directeur-ia-data"

export function ChatPanel({ initialMessages }: { initialMessages: ChatMessage[] }) {
  const [draft, setDraft] = useState("")

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex-1 space-y-4">
        {initialMessages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="text-xs">
                {message.role === "assistant" ? <Sparkles className="size-3.5" /> : "V"}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                message.role === "assistant"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Demandez quelque chose sur votre business…"
          disabled
        />
        <Button type="submit" size="icon" disabled aria-label="Envoyer">
          <ArrowUp />
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        Aperçu de démonstration — le chat sera connecté à vos données une fois l&apos;IA branchée.
      </p>
    </div>
  )
}
