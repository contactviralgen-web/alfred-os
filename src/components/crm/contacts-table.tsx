import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Users } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type ContactLigne = {
  id: string
  prenom: string | null
  nom: string | null
  email: string | null
  statut: string
  tags: string[]
  resume: { nombre_commandes: number | null; total_depense: number | null } | null
}

const LIBELLES_STATUT: Record<string, "secondary" | "outline" | "destructive"> = {
  client: "secondary",
  prospect: "outline",
  perdu: "destructive",
}

export function ContactsTable({
  contacts,
  orgSlug,
  workspaceSlug,
}: {
  contacts: ContactLigne[]
  orgSlug: string
  workspaceSlug: string
}) {
  if (contacts.length === 0) {
    return (
      <EmptyState
        icone={Users}
        titre="Aucun client pour le moment"
        description="Les clients apparaissent automatiquement à partir de vos commandes."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Commandes</TableHead>
          <TableHead>Total dépensé</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id} className="cursor-pointer">
            <TableCell>
              <Link href={`/${orgSlug}/${workspaceSlug}/crm/${contact.id}`} className="block">
                <span className="text-sm font-medium">
                  {[contact.prenom, contact.nom].filter(Boolean).join(" ") || "Sans nom"}
                </span>
                {contact.email ? (
                  <span className="block text-xs text-muted-foreground">{contact.email}</span>
                ) : null}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant={LIBELLES_STATUT[contact.statut] ?? "outline"}>
                {contact.statut}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{contact.resume?.nombre_commandes ?? 0}</TableCell>
            <TableCell className="text-sm">
              {(contact.resume?.total_depense ?? 0).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
