import { AppShell } from "@/components/layout/app-shell"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { getProfil } from "@/lib/auth/session"
import { listerOrganisationsUtilisateur } from "@/modules/core/services/organizations.service"
import { listerWorkspaces } from "@/modules/core/services/workspaces.service"
import { listerNotificationsUtilisateur } from "@/modules/dashboard/services/productivity.service"

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params

  // Le contexte (org/workspace/permissions) et les données indépendantes de
  // l'utilisateur courant n'ont pas de dépendance entre eux : on les lance
  // en parallèle plutôt qu'en chaîne pour réduire la latence de navigation.
  const [{ organisation, workspace, permissions }, organisations, profil, notifications] =
    await Promise.all([
      exigerContexteWorkspace(orgSlug, workspaceSlug),
      listerOrganisationsUtilisateur(),
      getProfil(),
      listerNotificationsUtilisateur(),
    ])

  const workspaces = await listerWorkspaces(organisation.id)

  return (
    <AppShell
      contexte={{
        orgSlug,
        workspaceSlug,
        organisationNom: organisation.nom,
        workspaceNom: workspace.nom,
        permissions,
      }}
      organisations={organisations.map((o) => ({ slug: o.slug, nom: o.nom }))}
      workspaces={workspaces.map((w) => ({ slug: w.slug, nom: w.nom }))}
      utilisateurNom={profil?.nom_complet ?? null}
      utilisateurEmail={profil?.email ?? ""}
      notifications={notifications}
    >
      {children}
    </AppShell>
  )
}
