import { z } from "zod"

export const schemaReglagesWorkspace = z.object({
  taux_tva_pct: z.coerce.number().min(0).max(100),
  prix_ttc: z.boolean(),
})

export const schemaCoutsProduit = z.object({
  cout_transport_flat: z.coerce.number().min(0),
  cout_douane_flat: z.coerce.number().min(0),
  frais_amazon_pct: z.coerce.number().min(0).max(100),
  frais_fba_flat: z.coerce.number().min(0),
  frais_stockage_unitaire_flat: z.coerce.number().min(0),
  taux_retour_pct: z.coerce.number().min(0).max(100),
  cout_divers_flat: z.coerce.number().min(0),
})
