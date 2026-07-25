import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { getCurrentUserAndOrganization } from "@/lib/organizations/current"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, organization } = await getCurrentUserAndOrganization()

  if (!user) {
    redirect("/connexion")
  }

  if (!organization) {
    redirect("/connexion")
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} organization={organization} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
