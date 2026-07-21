"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

import { supprimerEquipeAction } from "@/lib/actions/team.actions"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type EquipeLigne = {
  id: string
  nom: string
  description: string | null
  team_members: { count: number }[]
}

export function TeamsTable({
  equipes,
  peutGerer,
}: {
  equipes: EquipeLigne[]
  peutGerer: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (equipes.length === 0) {
    return (
      <EmptyState
        titre="Aucune équipe"
        description="Créez des équipes pour organiser vos collaborateurs."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Équipe</TableHead>
          <TableHead>Membres</TableHead>
          {peutGerer ? <TableHead className="w-10" /> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipes.map((equipe) => (
          <TableRow key={equipe.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{equipe.nom}</span>
                {equipe.description ? (
                  <span className="text-xs text-muted-foreground">
                    {equipe.description}
                  </span>
                ) : null}
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {equipe.team_members[0]?.count ?? 0}
            </TableCell>
            {peutGerer ? (
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const resultat = await supprimerEquipeAction(equipe.id)
                      if (!resultat.succes) {
                        toast.error(resultat.message)
                        return
                      }
                      router.refresh()
                    })
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
