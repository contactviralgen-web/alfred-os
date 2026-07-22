"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Zap } from "lucide-react"

import {
  basculerRegleActiveAction,
  creerRegleAction,
  executerAutomatisationsAction,
} from "@/lib/actions/automation.actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Regle = {
  id: string
  nom: string
  declencheur: string
  action: string
  actif: boolean
  description: string | null
  libelleDeclencheur: string
  libelleAction: string
}

const DECLENCHEURS = [
  { valeur: "stock_bas", libelle: "Alerte de stock" },
  { valeur: "commande_bloquee", libelle: "Commande bloquée" },
  { valeur: "fournisseur_en_retard", libelle: "Fournisseur en retard" },
] as const
const ACTIONS = [
  { valeur: "creer_tache", libelle: "Créer une tâche" },
  { valeur: "envoyer_notification", libelle: "Envoyer une notification" },
] as const

function RuleToggle({ regle, orgSlug, workspaceSlug }: { regle: Regle; orgSlug: string; workspaceSlug: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function basculer(actif: boolean) {
    startTransition(async () => {
      const resultat = await basculerRegleActiveAction(orgSlug, workspaceSlug, regle.id, actif)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      router.refresh()
    })
  }

  return <Switch checked={regle.actif} disabled={isPending} onCheckedChange={basculer} />
}

function NewRuleDialog({ orgSlug, workspaceSlug }: { orgSlug: string; workspaceSlug: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [nom, setNom] = useState("")
  const [declencheur, setDeclencheur] = useState<(typeof DECLENCHEURS)[number]["valeur"]>("stock_bas")
  const [action, setAction] = useState<(typeof ACTIONS)[number]["valeur"]>("creer_tache")
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const resultat = await creerRegleAction(orgSlug, workspaceSlug, { nom, declencheur, action })
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      setNom("")
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm"><Plus />Nouvelle règle</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle règle d&apos;automatisation</DialogTitle>
          <DialogDescription>
            Sera appliquée pour de vrai sur vos données au prochain clic sur &quot;Exécuter
            maintenant&quot;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Nom</Label>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Déclencheur</Label>
            <select
              value={declencheur}
              onChange={(e) => setDeclencheur(e.target.value as typeof declencheur)}
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
            >
              {DECLENCHEURS.map((d) => (
                <option key={d.valeur} value={d.valeur}>{d.libelle}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Action</Label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as typeof action)}
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
            >
              {ACTIONS.map((a) => (
                <option key={a.valeur} value={a.valeur}>{a.libelle}</option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !nom.trim()}>
              {isPending ? "Création..." : "Créer la règle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function RulesList({
  regles,
  orgSlug,
  workspaceSlug,
}: {
  regles: Regle[]
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function executer() {
    startTransition(async () => {
      const resultat = await executerAutomatisationsAction(orgSlug, workspaceSlug)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      if (resultat.resultats.length === 0) {
        toast.info("Aucune règle active à exécuter.")
      } else {
        resultat.resultats.forEach((r) => toast.success(r))
      }
      router.refresh()
    })
  }

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">Règles</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={isPending} onClick={executer}>
            <Zap />
            {isPending ? "Exécution..." : "Exécuter maintenant"}
          </Button>
          <NewRuleDialog orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
        </div>
      </div>
      {regles.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune règle configurée.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {regles.map((regle) => (
            <div key={regle.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="font-medium">{regle.nom}</p>
                <p className="text-xs text-muted-foreground">
                  {regle.libelleDeclencheur} → {regle.libelleAction}
                </p>
              </div>
              <RuleToggle regle={regle} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
