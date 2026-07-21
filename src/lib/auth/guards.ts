import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { obtenirOrganisationParSlug } from "@/modules/core/services/organizations.service"
import {
  listerPermissionsUtilisateur,
  obtenirMembershipUtilisateur,
} from "@/modules/core/services/memberships.service"
import { obtenirWorkspaceParSlugs } from "@/modules/core/services/workspaces.service"

// cache() mémorise le résultat par requête serveur (même clé d'arguments) :
// le layout du workspace ET chaque page qu'il enveloppe appellent ce guard,
// sans cache() cela doublait les allers-retours Supabase (organisation,
// membership, permissions) à chaque navigation, d'où la latence ressentie
// au clic.
export const exigerContexteOrganisation = cache(async (orgSlug: string) => {
  const organisation = await obtenirOrganisationParSlug(orgSlug)
  if (!organisation) {
    redirect("/bienvenue")
  }

  const [membership, permissions] = await Promise.all([
    obtenirMembershipUtilisateur(organisation.id),
    listerPermissionsUtilisateur(organisation.id),
  ])

  if (!membership) {
    redirect("/bienvenue")
  }

  return { organisation, membership, permissions }
})

export const exigerContexteWorkspace = cache(
  async (orgSlug: string, workspaceSlug: string) => {
    // La résolution du workspace (par jointure sur le slug d'organisation) ne
    // dépend pas du résultat de exigerContexteOrganisation : lancée en
    // parallèle plutôt qu'après, elle ne coûte plus d'aller-retour Supabase
    // supplémentaire en série.
    const [contexteOrganisation, workspace] = await Promise.all([
      exigerContexteOrganisation(orgSlug),
      obtenirWorkspaceParSlugs(orgSlug, workspaceSlug),
    ])

    if (!workspace) {
      redirect(`/${orgSlug}`)
    }

    return { ...contexteOrganisation, workspace }
  }
)
