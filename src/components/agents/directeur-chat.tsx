"use client"

import { useRef, useState, useTransition } from "react"
import { ArrowUp, Sparkles } from "lucide-react"

import { poserQuestionDirecteurAction } from "@/lib/actions/directeur.actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { MessageChat } from "@/modules/agents/services/directeur.service"

const QUESTIONS_SUGGEREES = [
  "Fais-moi le résumé du matin",
  "Pourquoi les ventes ont-elles évolué cette semaine ?",
  "Quels produits dois-je recommander ?",
  "Quels sont les produits les moins rentables ?",
]

export function DirecteurChat({
  organisationNom,
  workspaceId,
}: {
  organisationNom: string
  workspaceId: string
}) {
  const [messages, setMessages] = useState<MessageChat[]>([])
  const [saisie, setSaisie] = useState("")
  const [isPending, startTransition] = useTransition()
  const finRef = useRef<HTMLDivElement>(null)

  function envoyer(question: string) {
    if (!question.trim() || isPending) return

    const historique = messages
    const prochainsMessages: MessageChat[] = [
      ...historique,
      { role: "user", content: question },
    ]
    setMessages(prochainsMessages)
    setSaisie("")

    startTransition(async () => {
      const resultat = await poserQuestionDirecteurAction(
        organisationNom,
        workspaceId,
        historique,
        question
      )
      setMessages((precedent) => [
        ...precedent,
        {
          role: "assistant",
          content: resultat.succes ? resultat.reponse : `⚠️ ${resultat.message}`,
        },
      ])
      requestAnimationFrame(() => finRef.current?.scrollIntoView({ behavior: "smooth" }))
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-lg space-y-4 pt-12 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="size-6" />
            </span>
            <div>
              <p className="text-lg font-medium">Directeur IA</p>
              <p className="text-sm text-muted-foreground">
                Pose une question sur {organisationNom} — chiffre d&apos;affaires, stock,
                commandes, produits. Les réponses s&apos;appuient sur vos données réelles.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {QUESTIONS_SUGGEREES.map((q) => (
                <button
                  key={q}
                  onClick={() => envoyer(q)}
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              key={i}
              className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <Card
                className={
                  message.role === "user"
                    ? "max-w-lg bg-foreground p-3 text-sm text-background shadow-none ring-0"
                    : "max-w-lg p-3 text-sm whitespace-pre-wrap shadow-none"
                }
              >
                {message.content}
              </Card>
            </div>
          ))
        )}
        {isPending ? (
          <div className="flex justify-start">
            <Card className="p-3 text-sm text-muted-foreground shadow-none">Réflexion...</Card>
          </div>
        ) : null}
        <div ref={finRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          envoyer(saisie)
        }}
        className="flex items-center gap-2 border-t border-border/60 p-4"
      >
        <input
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder="Posez une question sur votre entreprise..."
          className="flex-1 rounded-lg border border-input bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring"
        />
        <Button type="submit" size="icon" disabled={isPending || !saisie.trim()}>
          <ArrowUp className="size-4" />
        </Button>
      </form>
    </div>
  )
}
