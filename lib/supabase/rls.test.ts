import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import type { Database } from "@/types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasRealSupabaseConfig =
  Boolean(url && anonKey) &&
  !anonKey!.includes("placeholder") &&
  anonKey!.startsWith("eyJ");

describe("RLS smoke (requires real Supabase anon key)", () => {
  it.skipIf(!hasRealSupabaseConfig)(
    "anon can read published projects only",
    async () => {
    const supabase = createClient<Database>(url!, anonKey!);

    const { count: visibleCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    const { count: draftCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft");

    expect(visibleCount).toBeGreaterThan(0);
    expect(draftCount).toBe(0);

    const { data: settings } = await supabase
      .from("seo_settings")
      .select("site_name")
      .eq("locale", "es")
      .maybeSingle();

    expect(settings?.site_name).toBeTruthy();
    },
  );
});
