import { z } from "zod"

export const schemaRetour = z.object({
  productId: z.string().uuid("Produit invalide"),
  quantite: z.coerce.number().int().min(1, "La quantité doit être d'au moins 1"),
  motif: z.enum(["defectueux", "ne_correspond_pas", "taille_couleur", "change_avis", "autre"]),
})
