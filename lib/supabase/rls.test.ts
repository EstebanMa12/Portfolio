import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import type { Database } from "@/types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

describe("RLS smoke (requires .env.local)", () => {
  it.skipIf(!url || !anonKey)("anon can read published projects only", async () => {
    const supabase = createClient<Database>(url!, anonKey!);

    const { count: publishedCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    expect(publishedCount).toBe(3);

    const { data: settings } = await supabase
      .from("seo_settings")
      .select("site_name")
      .single();

    expect(settings?.site_name).toBe("Esteban Maya");
  });
});
