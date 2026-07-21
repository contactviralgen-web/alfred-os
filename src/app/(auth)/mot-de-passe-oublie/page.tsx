import type { Metadata } from "next"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = { title: "Mot de passe oublié — Business Pilot" }

export default function MotDePasseOubliePage() {
  return (
    <AuthCard
      titre="Mot de passe oublié"
      description="Recevez un lien pour réinitialiser votre mot de passe"
      pied={
        <Link href="/connexion" className="font-medium text-foreground hover:underline">
          Revenir à la connexion
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
