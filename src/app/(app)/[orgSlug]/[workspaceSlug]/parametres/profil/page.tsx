import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { ProfileForm } from "@/components/settings/profile-form"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { getProfil } from "@/lib/auth/session"

export const metadata: Metadata = { title: "Profil — Alfred OS" }

export default async function ParametresProfilPage() {
  const profil = await getProfil()

  return (
    <>
      <PageHeader titre="Profil" description="Vos informations personnelles" />
      <div className="space-y-8 p-6">
        <ProfileForm nomComplet={profil?.nom_complet ?? ""} email={profil?.email ?? ""} />
        <div className="max-w-md space-y-4 border-t border-border/60 pt-6">
          <div>
            <p className="text-sm font-medium">Changer de mot de passe</p>
            <p className="text-sm text-muted-foreground">
              Choisissez un nouveau mot de passe pour votre compte.
            </p>
          </div>
          <ResetPasswordForm />
        </div>
      </div>
    </>
  )
}
