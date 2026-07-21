import { z } from "zod"

export const schemaCreationOrganisation = z.object({
  nom: z.string().min(2, "Le nom de l'organisation doit contenir au moins 2 caractères"),
})

export type CreationOrganisationInput = z.infer<typeof schemaCreationOrganisation>
