import type { Metadata } from "next"
import { MailCheck } from "lucide-react"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"

export const metadata: Metadata = { title: "Vérifiez votre email — Business Pilot" }

export default function VerifierEmailPage() {
  return (
    <AuthCard
      titre="Vérifiez votre boîte mail"
      description="Un email de confirmation vient de vous être envoyé"
      pied={
        <Link href="/connexion" className="font-medium text-foreground hover:underline">
          Revenir à la connexion
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <MailCheck className="size-6" />
        </span>
        <p className="text-sm text-muted-foreground">
          Cliquez sur le lien de confirmation reçu par email pour activer votre
          compte, puis revenez vous connecter.
        </p>
      </div>
    </AuthCard>
  )
}
