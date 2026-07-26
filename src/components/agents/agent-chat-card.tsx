"use client"

import Image from "next/image"
import { ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AgentChatMessage = {
  role: "user" | "assistant"
  content: string
}

export function AgentChatCard({
  avatarSrc,
  name,
  role,
  initialMessages,
}: {
  avatarSrc: string
  name: string
  role: string
  initialMessages: AgentChatMessage[]
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center gap-3">
        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
          <Image src={avatarSrc} alt={name} fill className="object-cover object-top" />
        </div>
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{role}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex-1 space-y-4">
          {initialMessages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {message.role === "assistant" ? (
                <div className="relative size-7 shrink-0 overflow-hidden rounded-full bg-secondary">
                  <Image src={avatarSrc} alt={name} fill className="object-cover object-top" />
                </div>
              ) : (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                  V
                </div>
              )}
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

        <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder={`Demandez une analyse à ${name}…`} disabled />
          <Button type="submit" size="icon" disabled aria-label="Envoyer">
            <ArrowUp />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Aperçu de démonstration — le chat sera connecté à vos données une fois l&apos;IA branchée.
        </p>
      </CardContent>
    </Card>
  )
}
