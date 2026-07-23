"use server"

import { revalidatePath } from "next/cache"

import type { ResultatAction } from "@/lib/actions/auth.actions"
import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { genererDossier, mettreAJourStatutReclamation } from "@/modules/amazon/services/reimbursements.service"

export async function genererDossierAction(
  orgSlug: string,
  wsSlug: string,
  claimId: string
): Promise<ResultatAction> {
  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await genererDossier(claimId)
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/amazon`)
  return { succes: true, message: "Dossier généré par l'IA." }
}

export async function marquerSoumiseAction(
  orgSlug: string,
  wsSlug: string,
  claimId: string
): Promise<ResultatAction> {
  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await mettreAJourStatutReclamation(claimId, "soumis")
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/amazon`)
  return { succes: true, message: "Réclamation marquée comme soumise à Amazon." }
}

export async function marquerRecupereeAction(
  orgSlug: string,
  wsSlug: string,
  claimId: string
): Promise<ResultatAction> {
  await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    await mettreAJourStatutReclamation(claimId, "recupere")
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }

  revalidatePath(`/${orgSlug}/${wsSlug}/amazon`)
  return { succes: true, message: "Montant marqué comme récupéré." }
}
