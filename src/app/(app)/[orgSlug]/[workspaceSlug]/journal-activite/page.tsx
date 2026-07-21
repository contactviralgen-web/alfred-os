import type { Metadata } from "next"
import { Layers } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { exigerContexteOrganisation } from "@/lib/auth/guards"
import { listerActiviteRecente } from "@/modules/core/services/activity-log.service"

export const metadata: Metadata = { title: "Journal d'activité — Business Pilot" }

const LIBELLES_ACTION: Record<string, string> = {
  "organisation.creee": "a créé l'organisation",
  "organisation.modifiee": "a modifié les informations de l'organisation",
  "invitation.acceptee": "a rejoint l'organisation",
}

export default async function JournalActivitePage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const { organisation } = await exigerContexteOrganisation(orgSlug)
  const activites = await listerActiviteRecente(organisation.id)

  return (
    <>
      <PageHeader
        titre="Journal d'activité"
        description="Historique des actions sensibles de votre organisation"
      />
      <div className="p-6">
        {activites.length === 0 ? (
          <EmptyState icone={Layers} titre="Aucune activité enregistrée" />
        ) : (
          <div className="divide-y divide-border/60 rounded-lg border border-border/60">
            {activites.map((activite) => (
              <div key={activite.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>
                  <span className="font-medium">
                    {activite.profiles?.nom_complet ?? activite.profiles?.email ?? "Système"}
                  </span>{" "}
                  {LIBELLES_ACTION[activite.action] ?? activite.action}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(activite.cree_le).toLocaleString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
