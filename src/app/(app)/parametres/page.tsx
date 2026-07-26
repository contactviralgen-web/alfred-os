import { redirect } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getSettingsData } from "@/lib/organizations/profile"
import { updateAccount, updateOrganizationProfile } from "./actions"
import { SettingsTabs } from "./settings-tabs"

const SALES_CHANNELS = [
  { value: "amazon", label: "Amazon" },
  { value: "site_propre", label: "Site e-commerce propre (Shopify, etc.)" },
  { value: "autre_marketplace", label: "Autre marketplace" },
]

const CURRENCIES = [
  { value: "EUR", label: "EUR — Euro" },
  { value: "USD", label: "USD — Dollar américain" },
  { value: "GBP", label: "GBP — Livre sterling" },
]

function SavedBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm text-primary">
      {message}
    </div>
  )
}

export default async function ParametresPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; saved?: string }>
}) {
  const { tab, saved } = await searchParams
  const { account, organization } = await getSettingsData()

  if (!account || !organization) {
    redirect("/connexion")
  }

  const canEditOrganization = organization.role === "owner" || organization.role === "admin"

  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Gérez votre compte et les informations de votre entreprise."
      />

      <SettingsTabs
        defaultTab={tab === "compte" ? "compte" : "entreprise"}
        entrepriseContent={
          <>
            {saved === "entreprise" && (
              <SavedBanner message="Profil entreprise enregistré avec succès." />
            )}
            <Card>
              <CardHeader>
                <CardTitle>Informations de l&apos;entreprise</CardTitle>
                <CardDescription>
                  Ces informations sont utilisées pour enrichir le contexte de vos agents IA
                  (Financier, Marketing, Logistique, Directeur IA) — plus elles sont précises,
                  plus leurs analyses et recommandations seront pertinentes pour votre business.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateOrganizationProfile} className="space-y-5">
                  <input type="hidden" name="organizationId" value={organization.id} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={organization.name}
                        required
                        disabled={!canEditOrganization}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="industry">Secteur d&apos;activité</Label>
                      <Input
                        id="industry"
                        name="industry"
                        placeholder="Ex. Piscine et accessoires extérieurs"
                        defaultValue={organization.industry ?? ""}
                        disabled={!canEditOrganization}
                      />
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="businessDescription">Description de l&apos;activité</Label>
                    <Textarea
                      id="businessDescription"
                      name="businessDescription"
                      rows={5}
                      placeholder="Décrivez vos produits, votre clientèle, votre positionnement, vos particularités saisonnières…"
                      defaultValue={organization.businessDescription ?? ""}
                      disabled={!canEditOrganization}
                    />
                    <p className="text-xs text-muted-foreground">
                      Le champ le plus important pour l&apos;IA : plus il est complet, mieux les
                      agents comprendront votre entreprise.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>Canaux de vente</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {SALES_CHANNELS.map((channel) => (
                        <label
                          key={channel.value}
                          className="group/field flex items-center gap-2 text-sm"
                        >
                          <Checkbox
                            name="salesChannels"
                            value={channel.value}
                            defaultChecked={organization.salesChannels.includes(channel.value)}
                            disabled={!canEditOrganization}
                          />
                          {channel.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="currency">Devise</Label>
                      <Select
                        name="currency"
                        defaultValue={organization.currency}
                        disabled={!canEditOrganization}
                      >
                        <SelectTrigger id="currency" className="w-full">
                          <SelectValue placeholder="Devise" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="targetMarginPct">Marge nette cible (%)</Label>
                      <Input
                        id="targetMarginPct"
                        name="targetMarginPct"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="Ex. 20"
                        defaultValue={organization.targetMarginPct ?? ""}
                        disabled={!canEditOrganization}
                      />
                    </div>
                  </div>

                  {canEditOrganization ? (
                    <Button type="submit">Enregistrer</Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Seuls les propriétaires ou administrateurs peuvent modifier ces informations.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </>
        }
        compteContent={
          <>
            {saved === "compte" && <SavedBanner message="Compte enregistré avec succès." />}
            <Card>
              <CardHeader>
                <CardTitle>Votre compte</CardTitle>
                <CardDescription>Informations personnelles liées à votre connexion.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateAccount} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input id="fullName" name="fullName" defaultValue={account.fullName ?? ""} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="email">Adresse e-mail</Label>
                      <Input id="email" value={account.email ?? ""} disabled readOnly />
                    </div>
                  </div>
                  <Button type="submit">Enregistrer</Button>
                </form>
              </CardContent>
            </Card>
          </>
        }
      />
    </>
  )
}
