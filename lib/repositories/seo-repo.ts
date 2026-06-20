import { cachedQuery } from "@/lib/repositories/base";
import { createClient } from "@/lib/supabase/server";
import type { SeoSettings } from "@/lib/domain/seo/types";
import { seoSettingsSchema } from "@/lib/schemas/seo-settings";
import { unwrap, unwrapOptional } from "./base";

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteName: "Esteban Maya",
  titleTemplate: "%s | Esteban Maya",
  defaultDescription:
    "Software Engineer especializado en backend y sistemas distribuidos. Formación en Bioingeniería.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultOgImage: null,
  twitterHandle: "@estebanmaya",
};

function mapRow(row: {
  site_name: string;
  title_template: string;
  default_description: string;
  site_url: string;
  default_og_image: string | null;
  twitter_handle: string | null;
}): SeoSettings {
  return seoSettingsSchema.parse({
    siteName: row.site_name,
    titleTemplate: row.title_template,
    defaultDescription: row.default_description,
    siteUrl: row.site_url,
    defaultOgImage: row.default_og_image,
    twitterHandle: row.twitter_handle,
  });
}

async function fetchSettings(): Promise<SeoSettings> {
  try {
    const supabase = await createClient();
    const result = await supabase.from("seo_settings").select("*").single();
    const row = unwrapOptional(result);

    if (!row) {
      return DEFAULT_SEO_SETTINGS;
    }

    return mapRow(row);
  } catch {
    return DEFAULT_SEO_SETTINGS;
  }
}

export const getSettings = cachedQuery(fetchSettings);

export async function updateSettings(
  settings: SeoSettings,
): Promise<SeoSettings> {
  const parsed = seoSettingsSchema.parse(settings);
  const supabase = await createClient();

  const row = unwrap(
    await supabase
      .from("seo_settings")
      .update({
        site_name: parsed.siteName,
        title_template: parsed.titleTemplate,
        default_description: parsed.defaultDescription,
        site_url: parsed.siteUrl,
        default_og_image: parsed.defaultOgImage,
        twitter_handle: parsed.twitterHandle,
      })
      .eq("id", 1)
      .select("*")
      .single(),
  );

  return mapRow(row);
}
