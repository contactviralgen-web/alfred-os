import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { getCurrentUserAndOrganization } from "@/lib/organizations/current"

export default async function DashboardPage() {
  const { organization } = await getCurrentUserAndOrganization()

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description={`Santé business de ${organization?.name ?? "votre entreprise"}.`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Aucune donnée connectée pour l&apos;instant</CardTitle>
          <CardDescription>
            Une fois vos produits, ventes et campagnes publicitaires connectés,
            Profytt affichera ici votre santé business, vos alertes et vos
            recommandations prioritaires.
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  )
}
