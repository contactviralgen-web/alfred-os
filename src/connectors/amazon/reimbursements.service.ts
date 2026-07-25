import "server-only"

import { createClient } from "@/lib/supabase/server"

export type TypeIncident = "stock_perdu" | "stock_endommage" | "remboursement_manquant" | "frais_errone"
export type StatutReclamation = "detecte" | "dossier_pret" | "soumis" | "recupere" | "rejete"

const LABEL_TYPE: Record<TypeIncident, string> = {
  stock_perdu: "Stock perdu en entrepôt",
  stock_endommage: "Stock endommagé par Amazon",
  remboursement_manquant: "Remboursement client non compensé",
  frais_errone: "Frais Amazon facturé à tort",
}

export async function listerReclamations(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("reimbursement_claims")
    .select("id, type_incident, quantite, montant_estime, statut, dossier_texte, cree_le, products(nom, sku)")
    .eq("workspace_id", workspaceId)
    .order("cree_le", { ascending: false })

  return (data ?? []).map((c) => ({ ...c, libelleType: LABEL_TYPE[c.type_incident] }))
}

export async function obtenirMontantRecuperable(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("reimbursement_claims")
    .select("montant_estime, statut")
    .eq("workspace_id", workspaceId)
    .in("statut", ["detecte", "dossier_pret", "soumis"])

  return (data ?? []).reduce((s, c) => s + Number(c.montant_estime), 0)
}

export async function obtenirMontantRecupere(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("reimbursement_claims")
    .select("montant_estime")
    .eq("workspace_id", workspaceId)
    .eq("statut", "recupere")

  return (data ?? []).reduce((s, c) => s + Number(c.montant_estime), 0)
}

// Rédaction du dossier de réclamation : simulée/templatée pour la démo
// (aucun crédit Claude requis), même mécanique de repli que le Directeur IA
// — remplacer par un vrai appel Anthropic plus tard ne change ni la
// signature ni l'UI qui consomme ce texte. Amazon ne fournissant aucune API
// de dépôt de réclamation, ce texte reste toujours à copier/envoyer par le
// vendeur dans le Case Log de Seller Central.
function redigerDossier(
  typeIncident: TypeIncident,
  produitNom: string,
  sku: string,
  quantite: number,
  montant: number
): string {
  const motif: Record<TypeIncident, string> = {
    stock_perdu:
      `un écart d'inventaire constaté entre les unités expédiées vers l'entrepôt Amazon et les unités effectivement enregistrées en stock disponible`,
    stock_endommage:
      `des unités endommagées durant leur manutention ou leur stockage en entrepôt Amazon, constatées lors d'un contrôle qualité`,
    remboursement_manquant:
      `un remboursement client traité sans que le produit retourné n'ait été correctement recrédité au stock ou au vendeur`,
    frais_errone:
      `des frais logistiques (FBA) prélevés sur un poids/dimension supérieur au poids/dimension réel du produit`,
  }

  return `Objet : Demande de remboursement — ${LABEL_TYPE[typeIncident]}

Produit concerné : ${produitNom} (SKU ${sku})
Quantité concernée : ${quantite} unité(s)
Montant réclamé : ${montant.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}

Bonjour,

Nous constatons ${motif[typeIncident]} sur le produit référencé ci-dessus. Conformément à la politique de remboursement FBA d'Amazon, nous sollicitons la compensation de l'écart constaté.

Nous restons à votre disposition pour tout document complémentaire (rapport de stock, historique des mouvements, preuve d'expédition) nécessaire à l'instruction de ce dossier.

Cordialement,
L'équipe vendeur`
}

export async function genererDossier(claimId: string) {
  const supabase = await createClient()
  const { data: reclamation } = await supabase
    .from("reimbursement_claims")
    .select("type_incident, quantite, montant_estime, products(nom, sku)")
    .eq("id", claimId)
    .maybeSingle()

  if (!reclamation) throw new Error("Réclamation introuvable.")
  const produit = Array.isArray(reclamation.products) ? reclamation.products[0] : reclamation.products

  const dossier = redigerDossier(
    reclamation.type_incident,
    produit?.nom ?? "Produit",
    produit?.sku ?? "N/A",
    reclamation.quantite,
    Number(reclamation.montant_estime)
  )

  const { error } = await supabase
    .from("reimbursement_claims")
    .update({ dossier_texte: dossier, statut: "dossier_pret" })
    .eq("id", claimId)
  if (error) throw new Error("Impossible de générer le dossier.")

  return dossier
}

export async function mettreAJourStatutReclamation(claimId: string, statut: StatutReclamation) {
  const supabase = await createClient()
  const { error } = await supabase.from("reimbursement_claims").update({ statut }).eq("id", claimId)
  if (error) throw new Error("Impossible de mettre à jour la réclamation.")
}
