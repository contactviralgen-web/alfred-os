"use server"

import { revalidatePath } from "next/cache"

import type { ResultatAction } from "@/lib/actions/auth.actions"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { ajusterStock, mettreAJourSeuilAlerte } from "@/modules/stock/services/stock.service"
import { schemaAjustementStock, schemaSeuilAlerte } from "@/lib/validations/stock.schema"

export async function ajusterStockAction(
  orgSlug: string,
  wsSlug: string,
  productId: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaAjustementStock.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await ajusterStock(organisation.id, workspace.id, productId, analyse.data)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/stock`)
  revalidatePath(`/${orgSlug}/${wsSlug}/tableau-de-bord`)
  return { succes: true, message: "Stock mis à jour." }
}

export async function mettreAJourSeuilAlerteAction(
  orgSlug: string,
  wsSlug: string,
  productId: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaSeuilAlerte.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await mettreAJourSeuilAlerte(productId, analyse.data.seuil)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/stock`)
  return { succes: true, message: "Seuil d'alerte mis à jour." }
}
