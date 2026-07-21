import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = { title: "Créer un compte — Alfred OS" }

export default function InscriptionPage() {
  return (
    <AuthCard
      titre="Créez votre compte"
      description="Démarrez avec Alfred OS en quelques secondes"
      pied={
        <>
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-foreground hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthCard>
  )
}
