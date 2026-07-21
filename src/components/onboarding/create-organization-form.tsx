"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { creerOrganisationAction } from "@/lib/actions/organization.actions"
import {
  schemaCreationOrganisation,
  type CreationOrganisationInput,
} from "@/lib/validations/organization.schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function CreateOrganizationForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreationOrganisationInput>({
    resolver: zodResolver(schemaCreationOrganisation),
    defaultValues: { nom: "" },
  })

  function onSubmit(values: CreationOrganisationInput) {
    startTransition(async () => {
      const resultat = await creerOrganisationAction(values)
      // creerOrganisationAction redirige en cas de succès (redirect() lève une
      // exception interceptée par Next.js) : si on arrive ici, c'est un échec.
      if (resultat && !resultat.succes) {
        toast.error(resultat.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;organisation</FormLabel>
              <FormControl>
                <Input placeholder="Acme Distribution" autoFocus {...field} />
              </FormControl>
              <FormDescription>
                Vous pourrez inviter votre équipe et créer d&apos;autres
                workspaces juste après.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Création..." : "Créer mon organisation"}
        </Button>
      </form>
    </Form>
  )
}
