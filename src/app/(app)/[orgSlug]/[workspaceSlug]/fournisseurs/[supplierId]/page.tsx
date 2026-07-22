import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageHeader } from "@/components/shared/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupplierHeaderForm } from "@/components/fournisseurs/supplier-header-form"
import { SupplierOrdersPanel } from "@/components/fournisseurs/supplier-orders-panel"
import { SupplierInvoicesPanel } from "@/components/fournisseurs/supplier-invoices-panel"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { obtenirFournisseur } from "@/modules/fournisseurs/services/suppliers.service"

export const metadata: Metadata = { title: "Fournisseur — Pilot" }

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string; supplierId: string }>
}) {
  const { orgSlug, workspaceSlug, supplierId } = await params
  const { workspace } = await exigerContexteWorkspace(orgSlug, workspaceSlug)
  const donnees = await obtenirFournisseur(workspace.id, supplierId)

  if (!donnees) notFound()

  const { fournisseur, commandes, factures, tauxPonctualite, scoreRecommandation } = donnees

  return (
    <>
      <PageHeader
        titre={fournisseur.nom}
        description={`Fournisseur depuis le ${new Date(fournisseur.cree_le).toLocaleDateString("fr-FR")} — ${commandes.length} commande(s), ${factures.length} facture(s)`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Ponctualité : {tauxPonctualite != null ? `${tauxPonctualite}%` : "N/A"}
            </Badge>
            <Badge variant="default">Score recommandé : {scoreRecommandation}</Badge>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-4">
            <p className="mb-3 text-sm font-medium">Informations</p>
            <SupplierHeaderForm
              supplierId={fournisseur.id}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
              nom={fournisseur.nom}
              email={fournisseur.email}
              telephone={fournisseur.telephone}
              adresse={fournisseur.adresse}
              statut={fournisseur.statut}
              delaiLivraisonJours={fournisseur.delai_livraison_jours}
              notePerformance={fournisseur.note_performance}
            />
          </Card>

          <Card className="p-4">
            <Tabs defaultValue="commandes">
              <TabsList>
                <TabsTrigger value="commandes">Commandes</TabsTrigger>
                <TabsTrigger value="factures">Factures</TabsTrigger>
              </TabsList>
              <TabsContent value="commandes" className="mt-4">
                <SupplierOrdersPanel
                  supplierId={fournisseur.id}
                  orgSlug={orgSlug}
                  workspaceSlug={workspaceSlug}
                  commandes={commandes}
                />
              </TabsContent>
              <TabsContent value="factures" className="mt-4">
                <SupplierInvoicesPanel
                  supplierId={fournisseur.id}
                  orgSlug={orgSlug}
                  workspaceSlug={workspaceSlug}
                  factures={factures}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <Card className="p-4">
          <p className="mb-3 text-sm font-medium">Performance</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Note performance</span>
              <span className="font-medium">
                {fournisseur.note_performance != null
                  ? `${fournisseur.note_performance}/5`
                  : "Non renseignée"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Taux de ponctualité</span>
              <span className="font-medium">
                {tauxPonctualite != null ? `${tauxPonctualite}%` : "Pas de données"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Délai annoncé</span>
              <span className="font-medium">
                {fournisseur.delai_livraison_jours != null
                  ? `${fournisseur.delai_livraison_jours} jour(s)`
                  : "Non renseigné"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-muted-foreground">Score recommandé</span>
              <span className="font-medium">{scoreRecommandation} / 100</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
