"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { inscrire } from "@/lib/actions/auth.actions"
import { schemaInscription, type InscriptionInput } from "@/lib/validations/auth.schema"
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

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const form = useForm<InscriptionInput>({
    resolver: zodResolver(schemaInscription),
    defaultValues: { nomComplet: "", email: "", motDePasse: "" },
  })

  function onSubmit(values: InscriptionInput) {
    startTransition(async () => {
      const next = searchParams.get("next") || "/bienvenue"
      const resultat = await inscrire(values, next)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      router.push("/verifier-email")
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nomComplet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Jane Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email professionnel</FormLabel>
              <FormControl>
                <Input placeholder="vous@entreprise.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motDePasse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="8 caractères minimum" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Création du compte..." : "Créer mon compte"}
        </Button>
      </form>
    </Form>
  )
}
