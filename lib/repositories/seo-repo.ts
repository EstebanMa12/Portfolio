import { createClient } from "@/lib/supabase/server";
import type { SeoSettings } from "@/lib/domain/seo/types";

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
  return {
    siteName: row.site_name,
    titleTemplate: row.title_template,
    defaultDescription: row.default_description,
    siteUrl: row.site_url,
    defaultOgImage: row.default_og_image,
    twitterHandle: row.twitter_handle,
  };
}

export async function getSettings(): Promise<SeoSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .single();

    if (error || !data) {
      return DEFAULT_SEO_SETTINGS;
    }

    return mapRow(data);
  } catch {
    return DEFAULT_SEO_SETTINGS;
  }
}
