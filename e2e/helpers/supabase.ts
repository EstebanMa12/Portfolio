import { createClient } from "@supabase/supabase-js";

export function isE2EConfigured(): boolean {
  return Boolean(
    process.env.E2E_TEST_SECRET &&
      process.env.E2E_ADMIN_EMAIL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

export function createE2EAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function deleteArticleBySlug(slug: string, locale = "es") {
  const admin = createE2EAdminClient();
  await admin
    .from("articles")
    .delete()
    .eq("slug", slug)
    .eq("locale", locale);
}
