// Démo Module 4 (Ads Agent) : performance publicitaire Amazon Ads / Meta Ads.

export type Campagne = {
  plateforme: "Amazon Ads" | "Meta Ads"
  nom: string
  depenses: number
  caAttribue: number
  roas: number
  acos: number
  recommandation: "augmenter" | "reduire" | "couper" | "maintenir"
}

export const demoCampagnes: Campagne[] = [
  { plateforme: "Amazon Ads", nom: "Sponsored Products - Kit rangement", depenses: 1050, caAttribue: 8200, roas: 7.8, acos: 12.8, recommandation: "augmenter" },
  { plateforme: "Amazon Ads", nom: "Sponsored Brands - Thermos voyage", depenses: 1890, caAttribue: 7100, roas: 3.8, acos: 26.6, recommandation: "maintenir" },
  { plateforme: "Amazon Ads", nom: "Sponsored Products - Gourdes inox", depenses: 4600, caAttribue: 7540, roas: 1.6, acos: 61.0, recommandation: "couper" },
  { plateforme: "Meta Ads", nom: "Prospecting - Set couteaux céramique", depenses: 2350, caAttribue: 4900, roas: 2.1, acos: 48.0, recommandation: "reduire" },
  { plateforme: "Meta Ads", nom: "Retargeting - Organiseur tiroir", depenses: 780, caAttribue: 4680, roas: 6.0, acos: 16.7, recommandation: "augmenter" },
]

const depensesTotal = demoCampagnes.reduce((s, c) => s + c.depenses, 0)
const caAttribueTotal = demoCampagnes.reduce((s, c) => s + c.caAttribue, 0)

export const demoPubliciteResume = {
  depensesTotal,
  caAttribueTotal,
  roasMoyen: caAttribueTotal / depensesTotal,
  tacos: 0.087,
}

export type AgentMarketingChatMessage = {
  role: "user" | "assistant"
  content: string
}

export const demoAgentMarketingChat: AgentMarketingChatMessage[] = [
  { role: "user", content: "Quelle campagne gaspille mon budget ?" },
  {
    role: "assistant",
    content:
      "\"Sponsored Products - Gourdes inox\" tourne à 61 % d'ACOS pour un ROAS de seulement 1,6x : vous dépensez 4 600 €/mois pour à peine rentrer dans vos frais. Je recommande de la couper immédiatement et de réallouer ce budget vers \"Retargeting - Organiseur tiroir\", qui tourne à 6,0x ROAS.",
  },
]
