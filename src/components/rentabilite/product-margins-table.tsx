"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type LigneProduit = {
  productId: string
  nom: string
  categorie: string | null
  chiffreAffaires: number
  margeNette: number
  margePct: number
  unitesVendues: number
}

type LigneCategorie = { categorie: string; chiffreAffaires: number; margeNette: number; margePct: number }

function formaterEuros(valeur: number) {
  return valeur.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €"
}

export function ProductMarginsTable({
  parProduit,
  parCategorie,
}: {
  parProduit: LigneProduit[]
  parCategorie: LigneCategorie[]
}) {
  return (
    <Card className="p-4">
      <Tabs defaultValue="produit">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Classement par marge nette réelle (30 derniers jours)</p>
          <TabsList>
            <TabsTrigger value="produit">Par produit</TabsTrigger>
            <TabsTrigger value="categorie">Par catégorie</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="produit" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Unités vendues</TableHead>
                <TableHead>Chiffre d&apos;affaires</TableHead>
                <TableHead>Marge nette réelle</TableHead>
                <TableHead>% marge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parProduit.map((p) => (
                <TableRow key={p.productId}>
                  <TableCell className="text-sm font-medium">{p.nom}</TableCell>
                  <TableCell className="text-sm">{p.unitesVendues}</TableCell>
                  <TableCell className="text-sm">{formaterEuros(p.chiffreAffaires)}</TableCell>
                  <TableCell
                    className={`text-sm font-medium ${p.margeNette < 0 ? "text-destructive" : ""}`}
                  >
                    {formaterEuros(p.margeNette)}
                  </TableCell>
                  <TableCell className="text-sm">{p.margePct.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="categorie" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead>Chiffre d&apos;affaires</TableHead>
                <TableHead>Marge nette réelle</TableHead>
                <TableHead>% marge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parCategorie.map((c) => (
                <TableRow key={c.categorie}>
                  <TableCell className="text-sm font-medium">{c.categorie}</TableCell>
                  <TableCell className="text-sm">{formaterEuros(c.chiffreAffaires)}</TableCell>
                  <TableCell
                    className={`text-sm font-medium ${c.margeNette < 0 ? "text-destructive" : ""}`}
                  >
                    {formaterEuros(c.margeNette)}
                  </TableCell>
                  <TableCell className="text-sm">{c.margePct.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
