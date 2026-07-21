import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageHeader } from "@/components/shared/page-header"
import { Card } from "@/components/ui/card"
import { ContactHeaderForm } from "@/components/crm/contact-header-form"
import { ActivityTimeline } from "@/components/crm/activity-timeline"
import { AddActivityForm } from "@/components/crm/add-activity-form"
import { OrderHistory } from "@/components/crm/order-history"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { obtenirContact } from "@/modules/crm/services/contacts.service"

export const metadata: Metadata = { title: "Client — Pilot" }

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string; contactId: string }>
}) {
  const { orgSlug, workspaceSlug, contactId } = await params
  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)
  const donnees = await obtenirContact(workspace.id, contactId)

  if (!donnees) notFound()

  const { contact, resume, commandes, activites } = donnees
  const nomComplet = [contact.prenom, contact.nom].filter(Boolean).join(" ") || "Sans nom"

  return (
    <>
      <PageHeader
        titre={nomComplet}
        description={`Client depuis le ${new Date(contact.cree_le).toLocaleDateString("fr-FR")} — ${
          resume?.nombre_commandes ?? 0
        } commande(s), ${(resume?.total_depense ?? 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })} dépensés`}
      />
      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-4">
            <p className="mb-3 text-sm font-medium">Informations</p>
            <ContactHeaderForm
              contactId={contact.id}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
              prenom={contact.prenom}
              nom={contact.nom}
              email={contact.email}
              telephone={contact.telephone}
            />
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-sm font-medium">Activité</p>
            <AddActivityForm
              organizationId={organisation.id}
              workspaceId={workspace.id}
              contactId={contact.id}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
            />
            <div className="mt-6">
              <ActivityTimeline activites={activites} />
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <p className="mb-3 text-sm font-medium">Historique de commandes</p>
          <OrderHistory commandes={commandes} />
        </Card>
      </div>
    </>
  )
}
