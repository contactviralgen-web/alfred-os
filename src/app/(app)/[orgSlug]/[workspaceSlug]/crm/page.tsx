import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { ContactsTable } from "@/components/crm/contacts-table"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { listerContacts } from "@/modules/crm/services/contacts.service"

export const metadata: Metadata = { title: "CRM — Pilot" }

export default async function CrmPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)
  const contacts = await listerContacts(workspace.id)

  return (
    <>
      <PageHeader
        titre="CRM"
        description={`${contacts.length} client(s) — issus de vos commandes Amazon et autres canaux`}
      />
      <div className="p-6">
        <ContactsTable contacts={contacts} orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      </div>
    </>
  )
}
