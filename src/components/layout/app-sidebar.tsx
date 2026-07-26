"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Megaphone, Package, Sparkles, TrendingUp } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut } from "@/app/(app)/actions"
import type { CurrentOrganization, CurrentUser } from "@/lib/organizations/current"

const NAV_ITEMS = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/rentabilite", label: "Agent Financier", icon: TrendingUp },
  { href: "/publicite", label: "Agent Marketing", icon: Megaphone },
  { href: "/stock", label: "Agent Logistique", icon: Package },
  { href: "/directeur-ia", label: "Directeur IA", icon: Sparkles },
]

function initials(label: string) {
  return label
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function AppSidebar({
  user,
  organization,
}: {
  user: CurrentUser
  organization: CurrentOrganization
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-start gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <Image
            src="/logo-wordmark.png"
            alt="Profytt"
            width={166}
            height={50}
            className="h-5 w-auto group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/agents/trio.png"
            alt="Votre équipe d'agents IA"
            width={900}
            height={392}
            className="h-12 w-auto group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/logo-mark.png"
            alt="Profytt"
            width={24}
            height={38}
            className="hidden h-6 w-auto group-data-[collapsible=icon]:block"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{organization.name}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg">
                <Avatar className="size-6">
                  <AvatarFallback className="text-xs">
                    {initials(user.fullName ?? user.email ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">
                  {user.fullName ?? user.email}
                </span>
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <form action={signOut} className="w-full">
                  <button type="submit" className="flex w-full items-center gap-2">
                    <LogOut className="size-4" />
                    Se déconnecter
                  </button>
                </form>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
