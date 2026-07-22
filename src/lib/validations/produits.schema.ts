import { z } from "zod"

export const schemaProduit = z.object({
  sku: z.string().min(1, "Le SKU est obligatoire"),
  nom: z.string().min(1, "Le nom est obligatoire"),
  categorie: z.string().optional().or(z.literal("")),
  prix_achat: z.coerce.number().min(0, "Le prix d'achat doit être positif"),
  prix_vente: z.coerce.number().min(0, "Le prix de vente doit être positif"),
})
