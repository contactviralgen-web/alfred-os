import "server-only"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getUtilisateurConnecte } from "@/lib/auth/session"
import { creerTache } from "@/modules/dashboard/services/productivity.service"

export type Declencheur = "stock_bas" | "commande_bloquee" | "fournisseur_en_retard"
export type ActionAutomatisation = "creer_tache" | "envoyer_notification"

const LABEL_DECLENCHEUR: Record<Declencheur, string> = {
  stock_bas: "Alerte de stock (rupture ou stock bas)",
  commande_bloquee: "Commande client bloquée",
  fournisseur_en_retard: "Commande fournisseur en retard",
}
const LABEL_ACTION: Record<ActionAutomatisation, string> = {
  creer_tache: "Créer une tâche",
  envoyer_notification: "Envoyer une notification",
}

export async function listerRegles(workspaceId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("automation_rules")
    .select("id, nom, declencheur, action, actif, description")
    .eq("workspace_id", workspaceId)
    .order("cree_le")
  return (data ?? []).map((r) => ({
    ...r,
    libelleDeclencheur: LABEL_DECLENCHEUR[r.declencheur],
    libelleAction: LABEL_ACTION[r.action],
  }))
}

export async function basculerRegleActive(ruleId: string, actif: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("automation_rules").update({ actif }).eq("id", ruleId)
  if (error) throw new Error("Impossible de mettre à jour la règle.")
}

export type DonneesRegle = { nom: string; declencheur: Declencheur; action: ActionAutomatisation; description?: string | null }

export async function creerRegle(organizationId: string, workspaceId: string, donnees: DonneesRegle) {
  const supabase = await createClient()
  const { error } = await supabase.from("automation_rules").insert({
    organization_id: organizationId,
    workspace_id: workspaceId,
    nom: donnees.nom,
    declencheur: donnees.declencheur,
    action: donnees.action,
    description: donnees.description ?? null,
  })
  if (error) throw new Error("Impossible de créer la règle.")
}

export async function listerExecutions(workspaceId: string, limite = 15) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("automation_executions")
    .select("id, resume, cree_le, automation_rules(nom)")
    .eq("workspace_id", workspaceId)
    .order("cree_le", { ascending: false })
    .limit(limite)
  return data ?? []
}

async function tacheDejaCreeeAujourdhui(
  supabase: Awaited<ReturnType<typeof createClient>>,
  workspaceId: string,
  titre: string
) {
  const debutJour = new Date()
  debutJour.setHours(0, 0, 0, 0)
  const { data } = await supabase
    .from("tasks")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("titre", titre)
    .gte("cree_le", debutJour.toISOString())
    .maybeSingle()
  return !!data
}

async function detecterCiblesStockBas(supabase: Awaited<ReturnType<typeof createClient>>, workspaceId: string) {
  const { data } = await supabase
    .from("stock_alerts")
    .select("products(nom)")
    .eq("workspace_id", workspaceId)
    .eq("statut", "ouverte")
  return (data ?? []).map((a) => {
    const produit = Array.isArray(a.products) ? a.products[0] : a.products
    return {
      titre: `Réapprovisionner ${produit?.nom ?? "un produit"}`,
      description: "Alerte de stock ouverte détectée automatiquement.",
    }
  })
}

async function detecterCiblesCommandeBloquee(supabase: Awaited<ReturnType<typeof createClient>>, workspaceId: string) {
  const { data } = await supabase
    .from("orders")
    .select("numero_commande")
    .eq("workspace_id", workspaceId)
    .eq("statut", "bloquee")
  return (data ?? []).map((o) => ({
    titre: `Débloquer la commande ${o.numero_commande}`,
    description: "Commande client bloquée détectée automatiquement.",
  }))
}

async function detecterCiblesFournisseurEnRetard(supabase: Awaited<ReturnType<typeof createClient>>, workspaceId: string) {
  const { data } = await supabase
    .from("supplier_orders")
    .select("numero_commande, date_livraison_prevue, suppliers(nom)")
    .eq("workspace_id", workspaceId)
    .not("statut", "in", "(livree,annulee)")
    .lt("date_livraison_prevue", new Date().toISOString().slice(0, 10))

  return (data ?? []).map((o) => {
    const fournisseur = Array.isArray(o.suppliers) ? o.suppliers[0] : o.suppliers
    return {
      titre: `Relancer ${fournisseur?.nom ?? "le fournisseur"} — commande ${o.numero_commande}`,
      description: "Livraison fournisseur en retard détectée automatiquement.",
    }
  })
}

const DETECTEURS: Record<
  Declencheur,
  (supabase: Awaited<ReturnType<typeof createClient>>, workspaceId: string) => Promise<{ titre: string; description: string }[]>
> = {
  stock_bas: detecterCiblesStockBas,
  commande_bloquee: detecterCiblesCommandeBloquee,
  fournisseur_en_retard: detecterCiblesFournisseurEnRetard,
}

// Le cœur "réel" du module : chaque règle active est évaluée contre les
// vraies données actuelles (alertes stock, commandes bloquées, retards
// fournisseur), et crée pour de vrai une tâche/notification — dédoublonnée
// pour ne pas spammer si on clique plusieurs fois le même jour.
export async function executerAutomatisations(organizationId: string, workspaceId: string) {
  const supabase = await createClient()
  const utilisateur = await getUtilisateurConnecte()
  const regles = await listerRegles(workspaceId)
  const resultats: string[] = []

  for (const regle of regles.filter((r) => r.actif)) {
    const cibles = await DETECTEURS[regle.declencheur](supabase, workspaceId)
    let nbCreees = 0

    if (regle.action === "creer_tache") {
      for (const cible of cibles) {
        if (await tacheDejaCreeeAujourdhui(supabase, workspaceId, cible.titre)) continue
        await creerTache(organizationId, workspaceId, {
          assigneA: utilisateur?.id ?? null,
          titre: cible.titre,
          description: cible.description,
          priorite: "haute",
        })
        nbCreees++
      }
    } else if (cibles.length > 0 && utilisateur) {
      const admin = createAdminClient()
      await admin.from("notifications").insert({
        organization_id: organizationId,
        destinataire_id: utilisateur.id,
        type: "automatisation",
        titre: regle.nom,
        message: `${cibles.length} élément(s) détecté(s) : ${cibles.map((c) => c.titre).join(", ")}`,
        lue: false,
      })
      nbCreees = cibles.length
    }

    const resume =
      nbCreees > 0
        ? `${nbCreees} ${regle.action === "creer_tache" ? "tâche(s) créée(s)" : "notification envoyée"} — ${regle.nom}`
        : `Aucune nouvelle action nécessaire — ${regle.nom}`

    await supabase.from("automation_executions").insert({ rule_id: regle.id, workspace_id: workspaceId, resume })
    resultats.push(resume)
  }

  return resultats
}
