import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import type { Database } from "@/types/database.types"

// À utiliser dans les Server Components, Server Actions et Route Handlers.
// Ne jamais réutiliser une même instance entre plusieurs requêtes.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll appelé depuis un Server Component : ignoré sans risque car
            // le proxy (proxy.ts) rafraîchit déjà la session sur chaque requête.
          }
        },
      },
    }
  )
}
