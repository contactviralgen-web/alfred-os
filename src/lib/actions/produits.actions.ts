"use server"

import { revalidatePath } from "next/cache"

import { exigerContexteWorkspace } from "@/lib/auth/guards"
import { creerProduit, type ProduitSimple } from "@/modules/rentabilite/services/products.service"
import { schemaProduit } from "@/lib/validations/produits.schema"

export type ResultatCreationProduit =
  | { succes: true; produit: ProduitSimple }
  | { succes: false; message: string }

export async function creerProduitAction(
  orgSlug: string,
  wsSlug: string,
  input: unknown
): Promise<ResultatCreationProduit> {
  const analyse = schemaProduit.safeParse(input)
  if (!analyse.success) {
    return { succes: false, message: analyse.error.issues[0]?.message ?? "Formulaire invalide." }
  }

  const { organisation, workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)

  try {
    const produit = await creerProduit(organisation.id, workspace.id, {
      sku: analyse.data.sku,
      nom: analyse.data.nom,
      categorie: analyse.data.categorie || null,
      prixAchat: analyse.data.prix_achat,
      prixVente: analyse.data.prix_vente,
      margePlancherPct: analyse.data.marge_plancher_pct,
    })
    revalidatePath(`/${orgSlug}/${wsSlug}/rentabilite`)
    revalidatePath(`/${orgSlug}/${wsSlug}/fournisseurs`)
    return { succes: true, produit }
  } catch (erreur) {
    return {
      succes: false,
      message: erreur instanceof Error ? erreur.message : "Une erreur est survenue.",
    }
  }
}
