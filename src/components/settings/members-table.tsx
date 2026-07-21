import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type MembreLigne = {
  id: string
  statut: string
  cree_le: string
  profiles: { nom_complet: string | null; email: string; avatar_url: string | null } | null
  roles: { nom: string; slug: string } | null
}

export function MembersTable({ membres }: { membres: MembreLigne[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Membre</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Depuis</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {membres.map((membre) => (
          <TableRow key={membre.id}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-medium text-white">
                    {(membre.profiles?.nom_complet ?? membre.profiles?.email ?? "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {membre.profiles?.nom_complet ?? "Sans nom"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {membre.profiles?.email}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>{membre.roles?.nom ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={membre.statut === "actif" ? "secondary" : "outline"}>
                {membre.statut}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(membre.cree_le).toLocaleDateString("fr-FR")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
