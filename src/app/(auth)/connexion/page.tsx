import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Connexion — Pilot" }

export default function ConnexionPage() {
  return (
    <AuthCard
      titre="Content de vous revoir"
      description="Connectez-vous à votre espace Pilot"
      pied={
        <>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-foreground hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  )
}
