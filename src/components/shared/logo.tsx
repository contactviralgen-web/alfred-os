import { Sparkle } from "lucide-react"

import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <Sparkle className="size-4" strokeWidth={2.5} />
      </span>
      <span className="text-base tracking-tight">Pilot</span>
    </div>
  )
}
