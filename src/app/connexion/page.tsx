import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "./actions"

export default async function ConnexionPage({
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
            width={166}
            height={50}
            className="h-9 w-auto"
            priority
          />
          <h1 className="text-xl font-semibold tracking-tight">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Votre analyste IA e-commerce.
          </p>
        </div>

        <form action={signIn} className="space-y-4">
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
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-primary underline-offset-4 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
