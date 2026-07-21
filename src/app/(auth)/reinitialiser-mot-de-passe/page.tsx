import type { Metadata } from "next"

import { AuthCard } from "@/components/auth/auth-card"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = { title: "Nouveau mot de passe — Business Pilot" }

export default function ReinitialiserMotDePassePage() {
  return (
    <AuthCard
      titre="Choisissez un nouveau mot de passe"
      description="Cette page n'est accessible que depuis le lien reçu par email"
    >
      <ResetPasswordForm />
    </AuthCard>
  )
}
