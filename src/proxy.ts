import type { NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"

// Renommage Next.js 16 : "middleware.ts" est déprécié au profit de "proxy.ts"
// (fonction exportée "proxy" au lieu de "middleware").
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
