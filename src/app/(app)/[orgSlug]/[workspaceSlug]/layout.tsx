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
  const { organisation, workspace, permissions } = await exigerContexteWorkspace(
    orgSlug,
    workspaceSlug
  )

  const [organisations, workspaces, profil, notifications] = await Promise.all([
    listerOrganisationsUtilisateur(),
    listerWorkspaces(organisation.id),
    getProfil(),
    listerNotificationsUtilisateur(),
  ])

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
