"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Sparkles } from "lucide-react"

import { analyserRentabiliteAction } from "@/lib/actions/rentabilite.actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AnalyserRentabiliteButton({ orgSlug, workspaceSlug }: { orgSlug: string; workspaceSlug: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function analyser() {
    startTransition(async () => {
      const resultat = await analyserRentabiliteAction(orgSlug, workspaceSlug)
      if (!resultat.succes) {
        toast.error(resultat.message)
        return
      }
      toast.success(resultat.message)
      router.refresh()
    })
  }

  return (
    <Button size="sm" variant="outline" disabled={isPending} onClick={analyser}>
      <Sparkles className={cn("size-4", isPending && "animate-pulse")} />
      {isPending ? "Analyse..." : "Analyser la rentabilité"}
    </Button>
  )
}
