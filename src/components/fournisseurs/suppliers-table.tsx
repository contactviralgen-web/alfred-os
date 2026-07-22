"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Truck } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type FournisseurLigne = {
  id: string
  nom: string
  statut: string
  delai_livraison_jours: number | null
  note_performance: number | null
  tauxPonctualite: number | null
  scoreRecommandation: number
}

export function SuppliersTable({
  fournisseurs,
  orgSlug,
  workspaceSlug,
  action,
}: {
  fournisseurs: FournisseurLigne[]
  orgSlug: string
  workspaceSlug: string
  action?: React.ReactNode
}) {
  if (fournisseurs.length === 0) {
    return (
      <EmptyState
        icone={Truck}
        titre="Aucun fournisseur pour le moment"
        description="Ajoutez votre premier fournisseur pour commencer à suivre vos commandes d'achat."
        action={action}
      />
    )
  }

  const meilleurScore = Math.max(...fournisseurs.map((f) => f.scoreRecommandation))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fournisseur</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Délai moyen</TableHead>
          <TableHead>Ponctualité</TableHead>
          <TableHead>Note performance</TableHead>
          <TableHead>Score recommandé</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fournisseurs.map((fournisseur) => {
          const estTopRecommande =
            fournisseur.scoreRecommandation === meilleurScore && meilleurScore > 0
          return (
            <TableRow key={fournisseur.id} className="cursor-pointer">
              <TableCell>
                <Link
                  href={`/${orgSlug}/${workspaceSlug}/fournisseurs/${fournisseur.id}`}
                  className="block"
                >
                  <span className="text-sm font-medium">{fournisseur.nom}</span>
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={fournisseur.statut === "actif" ? "secondary" : "outline"}>
                  {fournisseur.statut}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {fournisseur.delai_livraison_jours != null
                  ? `${fournisseur.delai_livraison_jours} j`
                  : "—"}
              </TableCell>
              <TableCell className="text-sm">
                {fournisseur.tauxPonctualite != null ? `${fournisseur.tauxPonctualite}%` : "—"}
              </TableCell>
              <TableCell className="text-sm">
                {fournisseur.note_performance != null ? `${fournisseur.note_performance}/5` : "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{fournisseur.scoreRecommandation}</span>
                  {estTopRecommande ? (
                    <Badge variant="default">Top recommandé</Badge>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
