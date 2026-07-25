// Démo Module 4 (Executive Agent) : rapport hebdomadaire + fil de chat.

export const demoRapportHebdo = {
  semaine: "20 - 26 juillet 2026",
  sante: "Bonne, avec un point d'attention publicitaire" as const,
  topProblemes: [
    "ACOS de 61 % sur \"Gourdes inox 750ml\" — budget disproportionné vs marge.",
    "Rupture de stock prévue sous 9 jours sur \"Thermos voyage 500ml\".",
    "Taux de retour de 6,6 % sur \"Set couteaux céramique\", au-dessus de la moyenne catégorie.",
  ],
  topOpportunites: [
    "\"Kit rangement cuisine\" : marge nette 34 %, budget pub quasi nul — fort potentiel de scale.",
    "Campagne Meta \"Retargeting - Organiseur tiroir\" : ROAS 6,0 — augmenter le budget.",
    "Négocier le coût fournisseur du \"Thermos voyage\" (28 % de marge, volume en hausse).",
  ],
}

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export const demoChatMessages: ChatMessage[] = [
  { role: "user", content: "Pourquoi mon profit baisse ce mois-ci ?" },
  {
    role: "assistant",
    content:
      "Votre chiffre d'affaires progresse (+6,1 %) mais votre profit net recule car l'ACOS moyen a augmenté de 3,2 points, tiré principalement par la campagne \"Gourdes inox 750ml\" (ACOS 61 %, +2 900 € de dépense publicitaire ce mois-ci pour seulement +740 € de CA additionnel). Je recommande de couper cette campagne : impact estimé +2 100 €/mois de profit récupéré.",
  },
]
