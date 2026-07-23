"use server"

import { revalidatePath } from "next/cache"

import type { ResultatAction } from "@/lib/actions/auth.actions"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import {
  mettreAJourCoutsProduit,
  mettreAJourReglagesWorkspace,
} from "@/modules/rentabilite/services/margins.service"
import { schemaCoutsProduit, schemaReglagesWorkspace } from "@/lib/validations/rentabilite.schema"

export async function mettreAJourReglagesWorkspaceAction(
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaReglagesWorkspace.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await mettreAJourReglagesWorkspace(organisation.id, workspace.id, {
      tauxTvaPct: analyse.data.taux_tva_pct,
      prixTtc: analyse.data.prix_ttc,
    })
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/rentabilite`)
  revalidatePath(`/${orgSlug}/${wsSlug}/tableau-de-bord`)
  return { succes: true, message: "Réglages de TVA mis à jour." }
}

export async function mettreAJourCoutsProduitAction(
  orgSlug: string,
  wsSlug: string,
  productId: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaCoutsProduit.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await mettreAJourCoutsProduit(organisation.id, workspace.id, productId, {
      coutTransportFlat: analyse.data.cout_transport_flat,
      coutDouaneFlat: analyse.data.cout_douane_flat,
      fraisAmazonPct: analyse.data.frais_amazon_pct,
      fraisFbaFlat: analyse.data.frais_fba_flat,
      fraisStockageUnitaireFlat: analyse.data.frais_stockage_unitaire_flat,
      tauxRetourPct: analyse.data.taux_retour_pct,
      coutDiversFlat: analyse.data.cout_divers_flat,
      margePlancherPct: analyse.data.marge_plancher_pct,
    })
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/rentabilite`)
  revalidatePath(`/${orgSlug}/${wsSlug}/tableau-de-bord`)
  return { succes: true, message: "Charges du produit mises à jour." }
}
