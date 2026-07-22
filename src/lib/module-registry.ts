import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Boxes,
  Bot,
  Contact,
  Gauge,
  Layers,
  ListChecks,
  ShoppingCart,
  TrendingUp,
  Truck,
  Workflow,
} from "lucide-react"

export type ElementNavigation = {
  titre: string
  segment: string
  icone: LucideIcon
  permission?: string
  bientotDisponible?: boolean
}

export type ConfigurationModule = {
  id: string
  nav: ElementNavigation[]
}

// Registre central des modules de Pilot. Un futur module s'ajoute ici sans
// modifier le shell applicatif — voir src/modules/<module>/README.md pour le
// contrat d'interface attendu de chacun.
export const REGISTRE_MODULES: ConfigurationModule[] = [
  {
    id: "dashboard",
    nav: [
      {
        titre: "Tableau de bord",
        segment: "tableau-de-bord",
        icone: Gauge,
        permission: "dashboard.view",
      },
    ],
  },
  {
    id: "crm",
    nav: [{ titre: "CRM", segment: "crm", icone: Contact }],
  },
  {
    id: "fournisseurs",
    nav: [{ titre: "Fournisseurs", segment: "fournisseurs", icone: Truck }],
  },
  {
    id: "rentabilite",
    nav: [{ titre: "Rentabilité", segment: "rentabilite", icone: TrendingUp }],
  },
  {
    id: "amazon",
    nav: [
      {
        titre: "Amazon",
        segment: "amazon",
        icone: ShoppingCart,
        bientotDisponible: true,
      },
    ],
  },
  {
    id: "stock",
    nav: [{ titre: "Stock", segment: "stock", icone: Boxes, bientotDisponible: true }],
  },
  {
    id: "automation",
    nav: [
      {
        titre: "Automatisations",
        segment: "automatisations",
        icone: Workflow,
        bientotDisponible: true,
      },
    ],
  },
  {
    id: "agents",
    nav: [{ titre: "Directeur IA", segment: "directeur-ia", icone: Bot }],
  },
]

export const NAV_GENERAL: ElementNavigation[] = [
  { titre: "Tâches", segment: "taches", icone: ListChecks, bientotDisponible: true },
  { titre: "Notifications", segment: "notifications", icone: Bell },
  { titre: "Journal d'activité", segment: "journal-activite", icone: Layers },
]
