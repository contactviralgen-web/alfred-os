import type { Metadata } from "next"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { AcceptInvitationButton } from "@/components/onboarding/accept-invitation-button"
import { Button } from "@/components/ui/button"
import { getUtilisateurConnecte } from "@/lib/auth/session"
import { obtenirApercuInvitation } from "@/modules/core/services/invitations.service"

export const metadata: Metadata = { title: "Invitation — Pilot" }

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const apercu = await obtenirApercuInvitation(token)
  const utilisateur = await getUtilisateurConnecte()

  if (!apercu) {
    return (
      <AuthCard titre="Invitation introuvable" description="Ce lien n'est pas valide.">
        <p className="text-sm text-muted-foreground">
          Vérifiez le lien reçu ou demandez une nouvelle invitation à votre
          administrateur.
        </p>
      </AuthCard>
    )
  }

  const expiree = new Date(apercu.expire_le) < new Date()

  if (apercu.statut !== "en_attente" || expiree) {
    return (
      <AuthCard titre="Invitation expirée" description="Ce lien n'est plus valide.">
        <p className="text-sm text-muted-foreground">
          Cette invitation a déjà été utilisée, révoquée ou a expiré.
        </p>
      </AuthCard>
    )
  }

  const next = `/invitation/${token}`

  return (
    <AuthCard
      titre={`Rejoindre ${apercu.organization_nom}`}
      description={`Vous avez été invité en tant que "${apercu.role_nom}"`}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Invitation envoyée à <span className="text-foreground">{apercu.email}</span>
        </p>

        {utilisateur ? (
          <AcceptInvitationButton token={token} />
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              render={
                <Link href={`/connexion?redirect=${encodeURIComponent(next)}`}>
                  Se connecter pour accepter
                </Link>
              }
            />
            <Button
              variant="outline"
              className="w-full"
              render={
                <Link href={`/inscription?next=${encodeURIComponent(next)}`}>
                  Créer un compte
                </Link>
              }
            />
          </div>
        )}
      </div>
    </AuthCard>
  )
}
