// Business Intelligence Engine — Product Profitability.
// Formule du document : Revenue - Product Cost - Platform Fees -
// Advertising Cost - Logistics - Returns = Real Profit. Fonction pure,
// déterministe : aucune IA n'invente ces chiffres (Principe 1 du document),
// tous les agents et l'UI appellent cette même fonction.

export type LigneRentabilite = {
  chiffre_affaires: number
  quantite: number
  cout_transport_flat: number
  cout_douane_flat: number
  frais_amazon_pct: number
  frais_fba_flat: number
  frais_stockage_unitaire_flat: number
  taux_retour_pct: number
  cout_divers_flat: number
  taux_tva_pct: number
  prix_achat: number
}

export function calculerMargeLigne(ligne: LigneRentabilite) {
  const tva = (ligne.chiffre_affaires / (1 + ligne.taux_tva_pct / 100)) * (ligne.taux_tva_pct / 100)
  const chargesUnitaires =
    (ligne.prix_achat +
      ligne.cout_transport_flat +
      ligne.cout_douane_flat +
      ligne.frais_fba_flat +
      ligne.frais_stockage_unitaire_flat +
      ligne.cout_divers_flat) *
    ligne.quantite
  const chargesProportionnelles =
    ligne.chiffre_affaires * ((ligne.frais_amazon_pct + ligne.taux_retour_pct) / 100)
  const chargesTotal = chargesUnitaires + chargesProportionnelles + tva
  const margeNette = ligne.chiffre_affaires - chargesTotal
  const margePct = ligne.chiffre_affaires > 0 ? (margeNette / ligne.chiffre_affaires) * 100 : 0
  return { chargesTotal, tva, margeNette, margePct }
}
