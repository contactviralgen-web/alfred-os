"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateAccount(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  await supabase
    .from("profiles")
    .update({ full_name: fullName || null })
    .eq("id", user.id)

  revalidatePath("/parametres")
  redirect("/parametres?tab=compte&saved=compte")
}

export async function updateOrganizationProfile(formData: FormData) {
  const organizationId = String(formData.get("organizationId") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const industry = String(formData.get("industry") ?? "").trim()
  const businessDescription = String(formData.get("businessDescription") ?? "").trim()
  const currency = String(formData.get("currency") ?? "EUR").trim()
  const targetMarginRaw = String(formData.get("targetMarginPct") ?? "").trim()
  const targetMarginPct = targetMarginRaw ? Number(targetMarginRaw) : null
  const salesChannels = formData.getAll("salesChannels").map(String)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/connexion")
  }

  await supabase
    .from("organizations")
    .update({
      ...(name ? { name } : {}),
      industry: industry || null,
      business_description: businessDescription || null,
      currency,
      target_margin_pct:
        targetMarginPct !== null && !Number.isNaN(targetMarginPct) ? targetMarginPct : null,
      sales_channels: salesChannels,
    })
    .eq("id", organizationId)

  revalidatePath("/parametres")
  redirect("/parametres?tab=entreprise&saved=entreprise")
}
