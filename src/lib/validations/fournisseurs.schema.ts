import { z } from "zod"

export const schemaFournisseur = z.object({
  nom: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  notes: z.string().optional(),
  statut: z.enum(["actif", "inactif"]).optional(),
  delai_livraison_jours: z.coerce.number().int().min(0).optional().nullable(),
})

export const schemaLigneCommande = z.object({
  product_id: z.string().uuid("Produit invalide"),
  quantite: z.coerce.number().int().min(1, "La quantité doit être d'au moins 1"),
  prix_unitaire: z.coerce.number().min(0, "Le prix unitaire doit être positif"),
})

export const schemaCommandeFournisseur = z.object({
  supplier_id: z.string().uuid("Fournisseur invalide"),
  numero_commande: z.string().min(1, "Le numéro de commande est obligatoire"),
  date_commande: z.string().optional(),
  date_livraison_prevue: z.string().optional().or(z.literal("")),
  date_paiement_prevue: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
  lignes: z.array(schemaLigneCommande).min(1, "Ajoutez au moins un produit à la commande"),
})

export const schemaStatutCommandeFournisseur = z.object({
  statut: z.enum(["brouillon", "envoyee", "confirmee", "en_transit", "livree", "annulee"]),
  date_livraison_reelle: z.string().optional().or(z.literal("")),
})

export const schemaFactureFournisseur = z.object({
  supplier_id: z.string().uuid("Fournisseur invalide"),
  supplier_order_id: z.string().uuid().optional().or(z.literal("")),
  numero_facture: z.string().min(1, "Le numéro de facture est obligatoire"),
  montant: z.coerce.number().min(0, "Le montant doit être positif"),
  date_emission: z.string().optional(),
  date_echeance: z.string().optional().or(z.literal("")),
})
