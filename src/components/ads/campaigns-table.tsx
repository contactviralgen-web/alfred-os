import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Campagne } from "@/connectors/ads/ads.service"
import { LABEL_PLATEFORME } from "@/connectors/ads/ads.constants"

const VARIANT_STATUT = { active: "outline", en_pause: "secondary", terminee: "outline" } as const
const LABEL_STATUT = { active: "Active", en_pause: "En pause", terminee: "Terminée" } as const

const formatEur = (v: number) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function CampaignsTable({ campagnes }: { campagnes: Campagne[] }) {
  if (campagnes.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune campagne synchronisée pour l&apos;instant.</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campagne</TableHead>
            <TableHead>Plateforme</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dépense</TableHead>
            <TableHead>CA généré</TableHead>
            <TableHead>ROAS</TableHead>
            <TableHead>ACOS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campagnes.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="text-sm font-medium">{c.nom}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{LABEL_PLATEFORME[c.plateforme]}</TableCell>
              <TableCell>
                <Badge variant={VARIANT_STATUT[c.statut]}>{LABEL_STATUT[c.statut]}</Badge>
              </TableCell>
              <TableCell className="text-sm tabular-nums">{formatEur(c.depense)}</TableCell>
              <TableCell className="text-sm tabular-nums">{formatEur(c.chiffreAffairesGenere)}</TableCell>
              <TableCell className="text-sm tabular-nums">{c.roas.toFixed(1)}x</TableCell>
              <TableCell className="text-sm tabular-nums">
                <span className={c.acosPct > 40 ? "font-medium text-destructive" : ""}>
                  {c.acosPct.toFixed(0)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
