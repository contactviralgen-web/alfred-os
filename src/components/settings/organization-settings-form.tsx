"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { mettreAJourOrganisationAction } from "@/lib/actions/organization.actions"
import {
  schemaCreationOrganisation,
  type CreationOrganisationInput,
} from "@/lib/validations/organization.schema"
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
import { Label } from "@/components/ui/label"
import { usePermission } from "@/components/layout/app-shell-context"

export function OrganizationSettingsForm({
  organizationId,
  orgSlug,
  workspaceSlug,
  nom,
  slug,
  plan,
}: {
  organizationId: string
  orgSlug: string
  workspaceSlug: string
  nom: string
  slug: string
  plan: string
}) {
  const [isPending, startTransition] = useTransition()
  const peutGerer = usePermission("core.organization.manage")

  const form = useForm<CreationOrganisationInput>({
    resolver: zodResolver(schemaCreationOrganisation),
    defaultValues: { nom },
  })

  function onSubmit(values: CreationOrganisationInput) {
    startTransition(async () => {
      const resultat = await mettreAJourOrganisationAction(
        organizationId,
        orgSlug,
        workspaceSlug,
        values
      )
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
    })
  }

  return (
    <div className="max-w-lg space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l&apos;organisation</FormLabel>
                <FormControl>
                  <Input disabled={!peutGerer} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {peutGerer ? (
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          ) : null}
        </form>
      </Form>

      <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
        <div>
          <Label className="text-muted-foreground">Identifiant (slug)</Label>
          <p className="mt-1 text-sm">{slug}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Plan</Label>
          <p className="mt-1 text-sm capitalize">{plan}</p>
        </div>
      </div>
    </div>
  )
}
