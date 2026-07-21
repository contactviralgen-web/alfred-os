"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

import {
  connecterAvecMotDePasse,
  envoyerLienMagique,
} from "@/lib/actions/auth.actions"
import {
  schemaConnexion,
  schemaMagicLink,
  type ConnexionInput,
  type MagicLinkInput,
} from "@/lib/validations/auth.schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [modeLienMagique, setModeLienMagique] = useState(false)

  const formMotDePasse = useForm<ConnexionInput>({
    resolver: zodResolver(schemaConnexion),
    defaultValues: { email: "", motDePasse: "" },
  })

  const formLienMagique = useForm<MagicLinkInput>({
    resolver: zodResolver(schemaMagicLink),
    defaultValues: { email: "" },
  })

  function onSubmitMotDePasse(values: ConnexionInput) {
    startTransition(async () => {
      const resultat = await connecterAvecMotDePasse(values)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      const destination = searchParams.get("redirect") || "/bienvenue"
      router.push(destination)
      router.refresh()
    })
  }

  function onSubmitLienMagique(values: MagicLinkInput) {
    startTransition(async () => {
      const resultat = await envoyerLienMagique(values)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message ?? "Lien envoyé.")
    })
  }

  if (modeLienMagique) {
    return (
      <div className="space-y-4">
        <Form {...formLienMagique}>
          <form
            onSubmit={formLienMagique.handleSubmit(onSubmitLienMagique)}
            className="space-y-4"
          >
            <FormField
              control={formLienMagique.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="vous@entreprise.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Envoi en cours..." : "Recevoir un lien de connexion"}
            </Button>
          </form>
        </Form>
        <Button
          type="button"
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => setModeLienMagique(false)}
        >
          Revenir à la connexion par mot de passe
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Form {...formMotDePasse}>
        <form
          onSubmit={formMotDePasse.handleSubmit(onSubmitMotDePasse)}
          className="space-y-4"
        >
          <FormField
            control={formMotDePasse.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="vous@entreprise.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMotDePasse.control}
            name="motDePasse"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Mot de passe</FormLabel>
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">ou</span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setModeLienMagique(true)}
      >
        Recevoir un lien de connexion par email
      </Button>
    </div>
  )
}
