import { SettingsNav } from "@/components/settings/settings-nav"

export default async function ParametresLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string; workspaceSlug: string }>
}) {
  const { orgSlug, workspaceSlug } = await params

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-6">
        <h1 className="text-xl font-semibold tracking-tight">Paramètres</h1>
      </div>
      <SettingsNav orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
