"use client"

import { useState, useTransition } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { ForecastBadge } from "@/components/dashboard/forecast-badge"
import { obtenirPointsGraphiqueAction } from "@/lib/actions/dashboard.actions"
import type {
  MetriqueGraphique,
  PeriodeGraphique,
  PointGraphique,
} from "@/modules/dashboard/services/revenue-chart.service"
import { cn } from "@/lib/utils"

const PERIODES: { valeur: PeriodeGraphique; libelle: string }[] = [
  { valeur: "24h", libelle: "24h" },
  { valeur: "7j", libelle: "7 jours" },
  { valeur: "mois", libelle: "Mois" },
  { valeur: "annee", libelle: "Année" },
]

const SOUS_TITRES: Record<PeriodeGraphique, string> = {
  "24h": "Dernières 24 heures, par heure",
  "7j": "7 derniers jours",
  mois: "30 derniers jours + prévision",
  annee: "12 derniers mois",
}

function config(metrique: MetriqueGraphique): ChartConfig {
  return {
    valeur: {
      label: metrique === "ca" ? "Chiffre d'affaires" : "Bénéfice net réel",
      color: "var(--chart-1)",
    },
    valeurPrevue: { label: "Prévision", color: "var(--chart-2)" },
  }
}

function formaterAxeDate(periode: PeriodeGraphique, valeur: string) {
  if (periode === "24h") return valeur
  if (periode === "annee") return new Date(valeur).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
  return new Date(valeur).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

export function RevenueChart({
  donneesInitiales,
  orgSlug,
  workspaceSlug,
}: {
  donneesInitiales: PointGraphique[]
  orgSlug: string
  workspaceSlug: string
}) {
  const [periode, setPeriode] = useState<PeriodeGraphique>("mois")
  const [metrique, setMetrique] = useState<MetriqueGraphique>("ca")
  const [donnees, setDonnees] = useState<PointGraphique[]>(donneesInitiales)
  const [isPending, startTransition] = useTransition()

  function changerFiltre(nouvellePeriode: PeriodeGraphique, nouvelleMetrique: MetriqueGraphique) {
    setPeriode(nouvellePeriode)
    setMetrique(nouvelleMetrique)
    startTransition(async () => {
      const resultat = await obtenirPointsGraphiqueAction(
        orgSlug,
        workspaceSlug,
        nouvellePeriode,
        nouvelleMetrique
      )
      setDonnees(resultat)
    })
  }

  const afficherPrevision = metrique === "ca" && (periode === "7j" || periode === "mois")

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div>
          <p className="text-sm font-medium">
            {metrique === "ca" ? "Chiffre d'affaires" : "Bénéfice net réel"}
          </p>
          <p className="text-xs text-muted-foreground">{SOUS_TITRES[periode]}</p>
        </div>
        <div className="flex items-center gap-2">
          {afficherPrevision ? <ForecastBadge /> : null}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
            {(["ca", "benefice"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => changerFiltre(periode, m)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  metrique === m
                    ? "bg-foreground text-background"
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
                onClick={() => changerFiltre(p.valeur, metrique)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  periode === p.valeur
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent/60"
                )}
              >
                {p.libelle}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ChartContainer
        config={config(metrique)}
        className={cn("mt-4 aspect-auto h-72 w-full transition-opacity", isPending && "opacity-50")}
      >
        <AreaChart data={donnees} margin={{ left: 0, right: 8 }}>
          <defs>
            <linearGradient id="fillValeur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-valeur)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-valeur)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeOpacity={0.15} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) => formaterAxeDate(periode, value)}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
          <ChartTooltip
            content={
              <ChartTooltipContent labelFormatter={(value) => formaterAxeDate(periode, value)} indicator="dot" />
            }
          />
          <Area
            dataKey="valeur"
            type="monotone"
            fill="url(#fillValeur)"
            stroke="var(--color-valeur)"
            strokeWidth={2}
            connectNulls
          />
          {afficherPrevision ? (
            <Area
              dataKey="valeurPrevue"
              type="monotone"
              fill="none"
              stroke="var(--color-valeurPrevue)"
              strokeWidth={2}
              strokeDasharray="4 4"
              connectNulls
            />
          ) : null}
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}
