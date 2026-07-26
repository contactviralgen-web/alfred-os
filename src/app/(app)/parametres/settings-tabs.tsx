"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SettingsTabs({
  defaultTab,
  entrepriseContent,
  compteContent,
}: {
  defaultTab: "entreprise" | "compte"
  entrepriseContent: React.ReactNode
  compteContent: React.ReactNode
}) {
  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList>
        <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
        <TabsTrigger value="compte">Compte</TabsTrigger>
      </TabsList>
      <TabsContent value="entreprise" className="mt-4 space-y-4">
        {entrepriseContent}
      </TabsContent>
      <TabsContent value="compte" className="mt-4 space-y-4">
        {compteContent}
      </TabsContent>
    </Tabs>
  )
}
