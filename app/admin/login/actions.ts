"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithGitHub(nextPath = "/admin") {
  const supabase = await createClient();
  const siteUrl = getSiteUrl();
  const next = nextPath.startsWith("/admin") ? nextPath : "/admin";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect("/admin/login?error=auth");
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect("/admin/login?error=auth");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
