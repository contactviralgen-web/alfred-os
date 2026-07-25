import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { OverviewPanel } from "@/components/dashboard/overview-panel"
import { RecommendationsList } from "@/components/dashboard/recommendations-list"
import { getCurrentUserAndOrganization } from "@/lib/organizations/current"
import { demoRecommendations, demoTopProduits } from "@/lib/demo/dashboard-data"
import { demoRapportHebdo } from "@/lib/demo/directeur-ia-data"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
  const { organization } = await getCurrentUserAndOrganization()

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description={`Santé business de ${organization?.name ?? "votre entreprise"} — données de démonstration.`}
        status={`Santé business : ${demoRapportHebdo.sante.split(",")[0]}`}
      />

      <OverviewPanel />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendationsList items={demoRecommendations} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meilleurs produits</CardTitle>
            <CardDescription>Par chiffre d&apos;affaires, 30 derniers jours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {demoTopProduits.map((produit) => (
              <div
                key={produit.nom}
                className="flex items-center justify-between border-t border-border py-3 first:border-t-0 first:pt-0"
              >
                <div>
                  <p className="text-sm font-medium">{produit.nom}</p>
                  <p className="text-sm text-muted-foreground tabular-nums">{produit.ca}</p>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    produit.tendance === "up" ? "text-positive" : "text-negative"
                  )}
                >
                  {produit.margeNette}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
