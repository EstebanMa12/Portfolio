import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";
import type { ResolvedSeo, SeoFields, SeoSettings } from "./types";

export function formatTitle(
  titleTemplate: string,
  pageTitle: string,
  siteName: string,
): string {
  if (titleTemplate.includes("%s")) {
    return titleTemplate.replace("%s", pageTitle);
  }
  return `${pageTitle} | ${siteName}`;
}

export function buildLanguageAlternates(
  path: string,
): Record<string, string> {
  return {
    es: localizedPath(path, "es"),
    en: localizedPath(path, "en"),
    "x-default": localizedPath(path, "es"),
  };
}

export function resolvePageMeta(
  settings: SeoSettings,
  page: SeoFields,
  canonicalPath: string,
  type: "website" | "article" = "website",
  hreflangPath?: string,
): ResolvedSeo {
  const pageTitle = page.title?.trim() || settings.siteName;
  const title =
    page.title != null && page.title !== ""
      ? formatTitle(settings.titleTemplate, pageTitle, settings.siteName)
      : settings.siteName;

  const description = page.description?.trim() || settings.defaultDescription;
  const canonical = page.canonical?.trim() || `${settings.siteUrl}${canonicalPath}`;
  const ogImage = page.ogImage ?? settings.defaultOgImage;
  const images = ogImage ? [{ url: ogImage }] : [];

  return {
    title,
    description,
    canonical,
    languages: hreflangPath ? buildLanguageAlternates(hreflangPath) : undefined,
    robots: page.noindex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: settings.siteName,
      images,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
      ...(settings.twitterHandle
        ? { creator: settings.twitterHandle }
        : {}),
    },
  };
}

export function toMetadata(
  resolved: ResolvedSeo,
  _locale?: Locale,
  _path?: string,
): Metadata {
  void _locale;
  void _path;

  return {
    title: resolved.title,
    description: resolved.description,
    alternates: {
      canonical: resolved.canonical,
      ...(resolved.languages ? { languages: resolved.languages } : {}),
    },
    robots: resolved.robots,
    openGraph: resolved.openGraph,
    twitter: resolved.twitter,
  };
}
