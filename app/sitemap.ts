import type { MetadataRoute } from "next";
import { getArticleSlugs } from "@/lib/cache/public-queries";
import { localizedPath } from "@/lib/i18n/paths";
import { routing } from "@/lib/i18n/routing";
import { getSettings } from "@/lib/repositories/seo-repo";

const STATIC_PATHS = [
  "/",
  "/about",
  "/experience",
  "/projects",
  "/blog",
  "/contact",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (await getSettings("es")).siteUrl.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}${localizedPath(path, locale)}`,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.8,
        alternates: {
          languages: {
            es: `${siteUrl}${localizedPath(path, "es")}`,
            en: `${siteUrl}${localizedPath(path, "en")}`,
          },
        },
      });
    }

    const slugs = await getArticleSlugs(locale);
    for (const { slug, updatedAt } of slugs) {
      const path = `/blog/${slug}`;
      entries.push({
        url: `${siteUrl}${localizedPath(path, locale)}`,
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            es: `${siteUrl}${localizedPath(path, "es")}`,
            en: `${siteUrl}${localizedPath(path, "en")}`,
          },
        },
      });
    }
  }

  return entries;
}
