import { redirect } from "next/navigation"

// Le proxy (src/proxy.ts) a déjà redirigé les visiteurs non authentifiés vers
// /connexion : si on atteint cette page, l'utilisateur est forcément connecté.
export default function RootPage() {
  redirect("/bienvenue")
}
