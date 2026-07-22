import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"
import { SuppliersTable } from "@/components/fournisseurs/suppliers-table"
import { NewSupplierDialog } from "@/components/fournisseurs/new-supplier-dialog"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { listerFournisseurs } from "@/modules/fournisseurs/services/suppliers.service"

export const metadata: Metadata = { title: "Fournisseurs — Pilot" }

export default async function FournisseursPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params
  const { workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)
  const fournisseurs = await listerFournisseurs(workspace.id)

  const meilleur = fournisseurs
    .filter((f) => f.statut === "actif")
    .sort((a, b) => b.scoreRecommandation - a.scoreRecommandation)[0]

  return (
    <>
      <PageHeader
        titre="Fournisseurs"
        description={`${fournisseurs.length} fournisseur(s) — commandes d'achat et factures`}
        actions={<NewSupplierDialog orgSlug={orgSlug} workspaceSlug={workspaceSlug} />}
      />
      <div className="space-y-4 p-6">
        {meilleur ? (
          <Card className="flex items-center gap-3 border-primary/30 bg-primary/5 p-4">
            <Trophy className="size-5 text-primary" />
            <p className="text-sm">
              <span className="font-medium">Meilleur fournisseur du moment : {meilleur.nom}</span>
              <span className="text-muted-foreground">
                {" "}
                — Pilot le recommande pour vos prochaines commandes.
              </span>
            </p>
            <Badge variant="default" className="ml-auto">
              Score {meilleur.scoreRecommandation}/100
            </Badge>
          </Card>
        ) : null}
        <SuppliersTable
          fournisseurs={fournisseurs}
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
        />
      </div>
    </>
  )
}
