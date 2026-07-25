"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const fullName = String(formData.get("fullName") ?? "")

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) {
    redirect(`/inscription?error=${encodeURIComponent(error.message)}`)
  }

  if (!data.session) {
    redirect("/inscription/verifiez-vos-emails")
  }

  redirect("/")
}
