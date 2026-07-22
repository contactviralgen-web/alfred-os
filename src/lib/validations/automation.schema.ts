import { z } from "zod"

export const schemaRegleAutomatisation = z.object({
  nom: z.string().min(1, "Le nom est obligatoire"),
  declencheur: z.enum(["stock_bas", "commande_bloquee", "fournisseur_en_retard"]),
  action: z.enum(["creer_tache", "envoyer_notification"]),
  description: z.string().optional(),
})
