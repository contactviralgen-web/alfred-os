import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

// Échange le code PKCE reçu (confirmation d'email, magic link, reset de mot
// de passe) contre une session, puis redirige vers la destination demandée.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/bienvenue"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/connexion?erreur=lien_invalide`)
}
