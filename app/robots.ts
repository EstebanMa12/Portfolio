import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/repositories/seo-repo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getSettings("es");
  const base = siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
