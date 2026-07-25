import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrganization } from "./actions"

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/logo-mark.png" alt="Profytt" width={48} height={48} />
          <h1 className="text-xl font-semibold tracking-tight">
            Créez votre entreprise
          </h1>
          <p className="text-sm text-muted-foreground">
            Le nom de votre marque e-commerce (visible dans le tableau de bord).
          </p>
        </div>

        <form action={createOrganization} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom de l&apos;entreprise</Label>
            <Input id="name" name="name" autoComplete="organization" required />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            Continuer
          </Button>
        </form>
      </div>
    </div>
  )
}
