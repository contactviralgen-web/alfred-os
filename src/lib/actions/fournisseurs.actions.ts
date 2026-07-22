"use server"

import { revalidatePath } from "next/cache"

import type { ResultatAction } from "@/lib/actions/auth.actions"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import {
  creerFournisseur,
  mettreAJourFournisseur,
} from "@/modules/fournisseurs/services/suppliers.service"
import {
  creerCommandeFournisseur,
  mettreAJourStatutCommande,
} from "@/modules/fournisseurs/services/supplier-orders.service"
import {
  creerFacture,
  marquerFacturePayee,
} from "@/modules/fournisseurs/services/supplier-invoices.service"
import {
  schemaCommandeFournisseur as schemaCommande,
  schemaFactureFournisseur as schemaFacture,
  schemaFournisseur,
  schemaStatutCommandeFournisseur as schemaStatutCommande,
} from "@/lib/validations/fournisseurs.schema"

export async function creerFournisseurAction(
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaFournisseur.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await creerFournisseur(organisation.id, workspace.id, analyse.data)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs`)
  return { succes: true, message: "Fournisseur créé." }
}

export async function mettreAJourFournisseurAction(
  supplierId: string,
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaFournisseur.partial({ nom: true }).safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await mettreAJourFournisseur(supplierId, analyse.data)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs/${supplierId}`)
  return { succes: true, message: "Fournisseur mis à jour." }
}

export async function creerCommandeFournisseurAction(
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaCommande.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await creerCommandeFournisseur(organisation.id, workspace.id, {
      ...analyse.data,
      date_livraison_prevue: analyse.data.date_livraison_prevue || null,
      date_paiement_prevue: analyse.data.date_paiement_prevue || null,
    })
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs/${analyse.data.supplier_id}`)
  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs`)
  return { succes: true, message: "Commande créée." }
}

export async function mettreAJourStatutCommandeAction(
  orderId: string,
  supplierId: string,
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaStatutCommande.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await mettreAJourStatutCommande(
      orderId,
      analyse.data.statut,
      analyse.data.date_livraison_reelle || null
    )
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs/${supplierId}`)
  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs`)
  return { succes: true, message: "Statut de la commande mis à jour." }
}

export async function marquerCommandeRecueAction(
  orderId: string,
  supplierId: string,
  orgSlug: string,
  wsSlug: string
): Promise<ResultatAction> {
  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await mettreAJourStatutCommande(orderId, "livree", new Date().toISOString().slice(0, 10))
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs/${supplierId}`)
  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs`)
  return { succes: true, message: "Commande marquée comme reçue." }
}

export async function creerFactureAction(
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatAction> {
  const analyse = schemaFacture.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await creerFacture(organisation.id, workspace.id, {
      ...analyse.data,
      supplier_order_id: analyse.data.supplier_order_id || null,
      date_echeance: analyse.data.date_echeance || null,
    })
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs/${analyse.data.supplier_id}`)
  return { succes: true, message: "Facture créée." }
}

export async function marquerFacturePayeeAction(
  invoiceId: string,
  supplierId: string,
  orgSlug: string,
  wsSlug: string
): Promise<ResultatAction> {
  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await marquerFacturePayee(invoiceId)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs/${supplierId}`)
  return { succes: true, message: "Facture marquée comme payée." }
}
