"use client"

import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { deconnecter } from "@/lib/actions/auth.actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopbarUserMenu({
  nom,
  email,
  orgSlug,
  workspaceSlug,
}: {
  nom: string | null
  email: string
  orgSlug: string
  workspaceSlug: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const initiale = (nom ?? email).slice(0, 1).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button type="button" className="rounded-full outline-none">
            <Avatar className="size-8">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-medium text-white">
                {initiale}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="truncate font-medium">{nom ?? "Mon compte"}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href={`/${orgSlug}/${workspaceSlug}/parametres/profil`} />}
        >
          <User className="size-4" />
          Mon profil
        </DropdownMenuItem>
        <DropdownMenuItem
          render={<Link href={`/${orgSlug}/${workspaceSlug}/parametres/organisation`} />}
        >
          <Settings className="size-4" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await deconnecter()
              router.push("/connexion")
              router.refresh()
            })
          }
        >
          <LogOut className="size-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
