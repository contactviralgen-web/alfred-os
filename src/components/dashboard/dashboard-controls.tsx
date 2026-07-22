"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import type { MetriqueGraphique, PeriodeGraphique } from "@/modules/dashboard/services/revenue-chart.types"

const PERIODES: { valeur: PeriodeGraphique; libelle: string }[] = [
  { valeur: "24h", libelle: "24h" },
  { valeur: "7j", libelle: "7 jours" },
  { valeur: "mois", libelle: "Mois" },
  { valeur: "annee", libelle: "Année" },
]

// Pilote l'ensemble du tableau de bord (KPI, répartition par canal, graphique)
// via l'URL (?periode=&metrique=) plutôt qu'un state client isolé — un
// changement de filtre re-render toute la page côté serveur avec la nouvelle
// plage de dates, sans plomberie de fetch dupliquée par widget.
export function DashboardControls({
  periode: periodeParDefaut,
  metrique: metriqueParDefaut,
}: {
  periode: PeriodeGraphique
  metrique: MetriqueGraphique
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Lire l'état actuel depuis l'URL plutôt que des props (qui reflètent le
  // dernier rendu serveur reçu) évite qu'un double-clic rapide avant la fin
  // de la première navigation ne reparte d'une valeur pas encore à jour.
  const periode = (searchParams.get("periode") as PeriodeGraphique | null) ?? periodeParDefaut
  const metrique = (searchParams.get("metrique") as MetriqueGraphique | null) ?? metriqueParDefaut

  function naviguer(nouvellePeriode: PeriodeGraphique, nouvelleMetrique: MetriqueGraphique) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("periode", nouvellePeriode)
    params.set("metrique", nouvelleMetrique)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
        {(["ca", "benefice"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => naviguer(periode, m)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              metrique === m
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/60"
            )}
          >
            {m === "ca" ? "CA" : "Bénéfice"}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
        {PERIODES.map((p) => (
          <button
            key={p.valeur}
            type="button"
            onClick={() => naviguer(p.valeur, metrique)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              periode === p.valeur
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/60"
            )}
          >
            {p.libelle}
          </button>
        ))}
      </div>
    </div>
  )
}
