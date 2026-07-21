import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AuthCard } from "@/components/auth/auth-card"
import { CreateOrganizationForm } from "@/components/onboarding/create-organization-form"
import {
  listerOrganisationsUtilisateur,
  obtenirPremierWorkspaceSlug,
} from "@/modules/core/services/organizations.service"

export const metadata: Metadata = { title: "Bienvenue — Alfred OS" }

export default async function BienvenuePage() {
  const organisations = await listerOrganisationsUtilisateur()

  if (organisations.length > 0) {
    const workspaceSlug = await obtenirPremierWorkspaceSlug(organisations[0].id)
    redirect(`/${organisations[0].slug}/${workspaceSlug ?? "general"}/tableau-de-bord`)
  }

  return (
    <AuthCard
      titre="Bienvenue sur Alfred OS"
      description="Créez votre organisation pour démarrer"
    >
      <CreateOrganizationForm />
    </AuthCard>
  )
}
