import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "./actions"

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo-wordmark.png"
            alt="Profytt"
            width={220}
            height={40}
            className="h-9 w-auto"
            priority
          />
          <h1 className="text-xl font-semibold tracking-tight">Créer un compte</h1>
        </div>

        <form action={signUp} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" name="fullName" autoComplete="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            Créer mon compte
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-primary underline-offset-4 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
