"use client"

import { createContext, useContext } from "react"

export type ContexteApplicatif = {
  orgSlug: string
  workspaceSlug: string
  organisationNom: string
  workspaceNom: string
  permissions: string[]
}

const AppShellContext = createContext<ContexteApplicatif | null>(null)

export function AppShellProvider({
  value,
  children,
}: {
  value: ContexteApplicatif
  children: React.ReactNode
}) {
  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>
}

export function useAppShell() {
  const contexte = useContext(AppShellContext)
  if (!contexte) {
    throw new Error("useAppShell doit être utilisé à l'intérieur de <AppShellProvider>")
  }
  return contexte
}

export function usePermission(cle: string) {
  const { permissions } = useAppShell()
  return permissions.includes(cle)
}
