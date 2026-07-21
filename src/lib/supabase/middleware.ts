import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import type { Database } from "@/types/database.types"

const ROUTES_PUBLIQUES = [
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
  "/reinitialiser-mot-de-passe",
  "/verifier-email",
  "/invitation",
]

// Sous-ensemble des routes publiques réservées aux visiteurs non connectés :
// un utilisateur déjà authentifié en est redirigé vers l'onboarding. Les autres
// routes publiques (verifier-email, invitation) restent accessibles une fois
// connecté (ex: accepter une invitation depuis une session déjà ouverte).
const ROUTES_VISITEUR_UNIQUEMENT = [
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
  "/reinitialiser-mot-de-passe",
]

// Rafraîchit la session Supabase sur chaque requête et protège les routes de
// l'application. Appelé depuis proxy.ts (le nom "middleware.ts" est déprécié
// depuis Next.js 16 au profit de "proxy.ts", mais la logique elle-même reste
// un utilitaire réutilisable, d'où sa place dans lib/supabase).
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const estRoutePublique = ROUTES_PUBLIQUES.some((route) =>
    pathname.startsWith(route)
  )

  if (!user && !estRoutePublique) {
    const url = request.nextUrl.clone()
    url.pathname = "/connexion"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  const estRouteVisiteurUniquement = ROUTES_VISITEUR_UNIQUEMENT.some((route) =>
    pathname.startsWith(route)
  )

  if (user && estRouteVisiteurUniquement) {
    const url = request.nextUrl.clone()
    url.pathname = "/bienvenue"
    return NextResponse.redirect(url)
  }

  return response
}
