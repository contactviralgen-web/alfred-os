import { z } from "zod"

export const schemaConnexion = z.object({
  email: z.string().email("Adresse email invalide"),
  motDePasse: z.string().min(1, "Le mot de passe est requis"),
})

export type ConnexionInput = z.infer<typeof schemaConnexion>

export const schemaInscription = z.object({
  nomComplet: z.string().min(2, "Votre nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  motDePasse: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export type InscriptionInput = z.infer<typeof schemaInscription>

export const schemaMagicLink = z.object({
  email: z.string().email("Adresse email invalide"),
})

export type MagicLinkInput = z.infer<typeof schemaMagicLink>

export const schemaMotDePasseOublie = z.object({
  email: z.string().email("Adresse email invalide"),
})

export type MotDePasseOublieInput = z.infer<typeof schemaMotDePasseOublie>
