"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NewProductDialog } from "@/components/rentabilite/new-product-dialog"
import { cn } from "@/lib/utils"
import type { ProduitSimple } from "@/modules/rentabilite/services/products.service"

export function ProductCombobox({
  produits,
  value,
  onSelect,
  onProductCreated,
  orgSlug,
  workspaceSlug,
}: {
  produits: ProduitSimple[]
  value: string | null
  onSelect: (produit: ProduitSimple) => void
  onProductCreated: (produit: ProduitSimple) => void
  orgSlug: string
  workspaceSlug: string
}) {
  const [open, setOpen] = useState(false)
  const [dialogOuvert, setDialogOuvert] = useState(false)
  const selectionne = produits.find((p) => p.id === value)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            >
              <span className="truncate">
                {selectionne ? selectionne.nom : "Choisir un produit..."}
              </span>
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </Button>
          }
        />
        <PopoverContent className="w-72 p-0">
          <Command>
            <CommandInput placeholder="Rechercher un produit..." />
            <CommandList>
              <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
              <CommandGroup>
                {produits.map((produit) => (
                  <CommandItem
                    key={produit.id}
                    value={produit.nom}
                    onSelect={() => {
                      onSelect(produit)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "size-4",
                        value === produit.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{produit.nom}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{produit.sku}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setDialogOuvert(true)
                  }}
                >
                  <Plus className="size-4" />
                  Nouveau produit
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <NewProductDialog
        orgSlug={orgSlug}
        workspaceSlug={workspaceSlug}
        open={dialogOuvert}
        onOpenChange={setDialogOuvert}
        onCreated={(produit) => {
          onProductCreated(produit)
          onSelect(produit)
        }}
      />
    </>
  )
}
