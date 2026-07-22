import { z } from "zod"

export const schemaAjustementStock = z.object({
  type: z.enum(["entree", "sortie", "ajustement"]),
  quantite: z.coerce.number().int().min(1, "La quantité doit être d'au moins 1"),
  motif: z.string().optional(),
})

export const schemaSeuilAlerte = z.object({
  seuil: z.coerce.number().int().min(0, "Le seuil doit être positif ou nul"),
})
