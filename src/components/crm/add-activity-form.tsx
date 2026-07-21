"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Phone, Mail, Calendar, StickyNote } from "lucide-react"

import { ajouterActiviteAction } from "@/lib/actions/crm.actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const TYPES = [
  { valeur: "note" as const, icone: StickyNote, label: "Note" },
  { valeur: "appel" as const, icone: Phone, label: "Appel" },
  { valeur: "email" as const, icone: Mail, label: "Email" },
  { valeur: "rdv" as const, icone: Calendar, label: "RDV" },
]

export function AddActivityForm({
  organizationId,
  workspaceId,
  contactId,
  orgSlug,
  workspaceSlug,
}: {
  organizationId: string
  workspaceId: string
  contactId: string
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [type, setType] = useState<(typeof TYPES)[number]["valeur"]>("note")
  const [contenu, setContenu] = useState("")
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await ajouterActiviteAction(
        organizationId,
        workspaceId,
        contactId,
        orgSlug,
        workspaceSlug,
        { type, contenu }
      )
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      setContenu("")
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t.valeur}
            type="button"
            onClick={() => setType(t.valeur)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs",
              type === t.valeur
                ? "border-foreground bg-foreground text-background"
                : "border-border/60 text-muted-foreground hover:bg-accent/60"
            )}
          >
            <t.icone className="size-3.5" />
            {t.label}
          </button>
        ))}
      </div>
      <Textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Ajouter une note, un compte-rendu d'appel..."
        rows={3}
      />
      <Button type="submit" size="sm" disabled={isPending || !contenu.trim()}>
        {isPending ? "Ajout..." : "Ajouter"}
      </Button>
    </form>
  )
}
