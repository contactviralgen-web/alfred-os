// Démo Agent Marketing — Veille conformité : notifications de statut de compte
// et de politique Amazon (SP-API Notifications, ex. ACCOUNT_STATUS_CHANGED),
// résumées en langage clair par l'IA pour un point de suivi dans le CRM.

export type ComplianceNotification = {
  type: string
  gravite: "info" | "attention" | "urgent"
  resumeIA: string
  date: string
}

export const demoComplianceNotifications: ComplianceNotification[] = [
  {
    type: "Statut de compte",
    gravite: "info",
    resumeIA:
      "Votre statut de compte reste \"Normal\". Aucune action requise cette semaine.",
    date: "25 juil. 2026",
  },
  {
    type: "Politique de contenu produit",
    gravite: "attention",
    resumeIA:
      "Amazon a mis à jour ses règles sur les allégations \"sans BPA\" pour les articles de cuisine — vérifiez que vos fiches produits citent bien une certification quand cette mention est utilisée. Aucune de vos fiches n'est actuellement signalée, mais gardez ce point à l'œil sur \"Gourdes inox 750ml\".",
    date: "23 juil. 2026",
  },
  {
    type: "Taux de défaut commande",
    gravite: "urgent",
    resumeIA:
      "Votre taux de défaut commande est passé à 1,2 % (seuil Amazon : 1 %), principalement à cause des retours sur \"Set couteaux céramique\". Risque réel de passage en statut \"À risque\" si la tendance continue — je recommande de traiter les retours de ce produit en priorité.",
    date: "20 juil. 2026",
  },
]
