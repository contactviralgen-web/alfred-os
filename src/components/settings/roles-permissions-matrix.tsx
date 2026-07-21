import { Fragment } from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export type PermissionLigne = { id: string; cle: string; module: string; description: string | null }
export type RoleColonne = { id: string; nom: string; organization_id: string | null }

const LIBELLES_MODULES: Record<string, string> = {
  core: "Fondations",
  dashboard: "Tableau de bord",
  crm: "CRM",
  amazon: "Amazon",
  stock: "Stock",
  automation: "Automatisations",
  agents: "Agents IA",
}

export function RolesPermissionsMatrix({
  permissions,
  roles,
  aPermission,
}: {
  permissions: PermissionLigne[]
  roles: RoleColonne[]
  aPermission: (roleId: string, permissionId: string) => boolean
}) {
  const modules = Array.from(new Set(permissions.map((p) => p.module)))

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
              Permission
            </th>
            {roles.map((role) => (
              <th
                key={role.id}
                className={cn(
                  "min-w-24 px-3 py-2.5 text-center font-medium",
                  role.organization_id === null && "text-foreground"
                )}
              >
                {role.nom}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <Fragment key={module}>
              <tr className="bg-muted/10">
                <td
                  colSpan={roles.length + 1}
                  className="px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase"
                >
                  {LIBELLES_MODULES[module] ?? module}
                </td>
              </tr>
              {permissions
                .filter((p) => p.module === module)
                .map((permission) => (
                  <tr key={permission.id} className="border-b border-border/40 last:border-b-0">
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span>{permission.description ?? permission.cle}</span>
                        <span className="text-xs text-muted-foreground">{permission.cle}</span>
                      </div>
                    </td>
                    {roles.map((role) => (
                      <td key={role.id} className="px-3 py-2 text-center">
                        {aPermission(role.id, permission.id) ? (
                          <Check className="mx-auto size-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
