import { Phone, Mail, Calendar, StickyNote } from "lucide-react"

const ICONES = { note: StickyNote, appel: Phone, email: Mail, rdv: Calendar }

export type ActiviteLigne = {
  id: string
  type: "note" | "appel" | "email" | "rdv"
  contenu: string
  date_activite: string
  profiles: { nom_complet: string | null; email: string } | null
}

export function ActivityTimeline({ activites }: { activites: ActiviteLigne[] }) {
  if (activites.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune activité enregistrée.</p>
  }

  return (
    <div className="space-y-4">
      {activites.map((activite) => {
        const Icone = ICONES[activite.type] ?? StickyNote
        return (
          <div key={activite.id} className="flex gap-3">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icone className="size-3.5" />
            </span>
            <div className="flex-1">
              <p className="text-sm">{activite.contenu}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activite.profiles?.nom_complet ?? activite.profiles?.email ?? "Système"} ·{" "}
                {new Date(activite.date_activite).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
