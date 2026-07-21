import "server-only"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database.types"

// Client "service_role" : contourne totalement la RLS. Réservé aux Route
// Handlers/Server Actions qui en ont explicitement besoin (ex: administration
// des invitations par email). Ne jamais importer ce module dans un composant
// pouvant être bundlé côté client (le paquet "server-only" fait échouer le
// build si c'est le cas).
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
