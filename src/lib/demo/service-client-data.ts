// Démo Agent Marketing — Service client : demandes d'avis (Solicitations API)
// et réponses aux messages acheteurs dans les catégories autorisées par Amazon
// (Messaging API — pas de contenu libre, catégories imposées).

export type ReviewRequest = {
  commandeId: string
  produit: string
  dateCommande: string
  eligibleJusqua: string
  statut: "a-envoyer" | "envoyee" | "non-eligible"
}

export const demoReviewRequests: ReviewRequest[] = [
  { commandeId: "402-1183726-0451", produit: "Kit rangement cuisine", dateCommande: "12 juil. 2026", eligibleJusqua: "11 août 2026", statut: "a-envoyer" },
  { commandeId: "402-9042117-3382", produit: "Thermos voyage 500ml", dateCommande: "9 juil. 2026", eligibleJusqua: "8 août 2026", statut: "a-envoyer" },
  { commandeId: "402-7723841-9012", produit: "Organiseur tiroir x4", dateCommande: "2 juil. 2026", eligibleJusqua: "1 août 2026", statut: "envoyee" },
  { commandeId: "402-5561029-4471", produit: "Gourdes inox 750ml", dateCommande: "18 juin 2026", eligibleJusqua: "18 juil. 2026", statut: "non-eligible" },
]

export type CustomerMessage = {
  commandeId: string
  categorie: string
  question: string
  reponseSuggeree: string
  statut: "en-attente" | "envoyee"
}

export const demoCustomerMessages: CustomerMessage[] = [
  {
    commandeId: "402-1183726-0451",
    categorie: "Détails de livraison",
    question: "Bonjour, ma commande est-elle bien partie ? Je n'ai pas de numéro de suivi.",
    reponseSuggeree:
      "Bonjour, votre colis a bien été expédié le 13 juillet. Voici votre numéro de suivi : à retrouver dans la section \"Vos commandes\" de votre compte Amazon. Livraison prévue sous 2 à 3 jours ouvrés.",
    statut: "en-attente",
  },
  {
    commandeId: "402-9042117-3382",
    categorie: "Question produit",
    question: "Le thermos passe-t-il au lave-vaisselle ?",
    reponseSuggeree:
      "Bonjour, nous recommandons un lavage à la main pour préserver l'isolation double paroi, mais le bouchon supérieur passe au lave-vaisselle (panier du haut).",
    statut: "en-attente",
  },
  {
    commandeId: "402-7723841-9012",
    categorie: "Retour produit",
    question: "Comment renvoyer un article reçu abîmé ?",
    reponseSuggeree:
      "Nous sommes désolés pour ce désagrément. Un retour gratuit a été initié depuis votre compte Amazon, section \"Retourner ou remplacer des articles\". Le remboursement sera effectué dès réception.",
    statut: "envoyee",
  },
]
