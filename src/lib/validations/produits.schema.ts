import { z } from "zod"

export const schemaProduit = z.object({
  sku: z.string().min(1, "Le SKU est obligatoire"),
  nom: z.string().min(1, "Le nom est obligatoire"),
  categorie: z.string().optional().or(z.literal("")),
  prix_achat: z.coerce.number().min(0, "Le prix d'achat doit être positif"),
  prix_vente: z.coerce.number().min(0, "Le prix de vente doit être positif"),
  marge_plancher_pct: z.coerce
    .number()
    .min(20, "La marge plancher doit être d'au moins 20%")
    .max(90, "La marge plancher doit rester inférieure à 90%"),
})
