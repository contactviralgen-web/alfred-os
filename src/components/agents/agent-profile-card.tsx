import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function AgentProfileCard({
  avatarSrc,
  name,
  role,
  tagline,
}: {
  avatarSrc: string
  name: string
  role: string
  tagline: string
}) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="relative h-40 w-32 overflow-hidden rounded-xl bg-secondary">
          <Image src={avatarSrc} alt={name} fill className="object-cover object-top" />
        </div>
        <div>
          <p className="text-base font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <p className="text-sm text-muted-foreground">{tagline}</p>
      </CardContent>
    </Card>
  )
}
