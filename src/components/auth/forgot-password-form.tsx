"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { demanderReinitialisationMotDePasse } from "@/lib/actions/auth.actions"
import {
  schemaMotDePasseOublie,
  type MotDePasseOublieInput,
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

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [envoye, setEnvoye] = useState(false)

  const form = useForm<MotDePasseOublieInput>({
    resolver: zodResolver(schemaMotDePasseOublie),
    defaultValues: { email: "" },
  })

  function onSubmit(values: MotDePasseOublieInput) {
    startTransition(async () => {
      await demanderReinitialisationMotDePasse(values)
      setEnvoye(true)
    })
  }

  if (envoye) {
    return (
      <p className="text-sm text-muted-foreground">
        Si un compte existe avec cette adresse email, un lien de réinitialisation
        vient de vous être envoyé.
      </p>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          {isPending ? "Envoi..." : "Envoyer le lien de réinitialisation"}
        </Button>
      </form>
    </Form>
  )
}
