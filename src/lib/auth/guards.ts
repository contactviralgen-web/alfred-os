import "server-only"

import { redirect } from "next/navigation"

import { obtenirOrganisationParSlug } from "@/modules/core/services/organizations.service"
import {
  listerPermissionsUtilisateur,
  obtenirMembershipUtilisateur,
} from "@/modules/core/services/memberships.service"
import { obtenirWorkspaceParSlug } from "@/modules/core/services/workspaces.service"

// RLS garantit déjà qu'une organisation dont l'utilisateur n'est pas membre ne
// sera jamais retournée par obtenirOrganisationParSlug (elle apparaît "not found"
// pour un non-membre) : ce guard traduit simplement cette absence en redirection.
export async function exigerContexteOrganisation(orgSlug: string) {
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
}

export async function exigerContexteWorkspace(orgSlug: string, workspaceSlug: string) {
  const contexteOrganisation = await exigerContexteOrganisation(orgSlug)

  const workspace = await obtenirWorkspaceParSlug(
    contexteOrganisation.organisation.id,
    workspaceSlug
  )

  if (!workspace) {
    redirect(`/${orgSlug}`)
  }

  return { ...contexteOrganisation, workspace }
}
