import type { Metadata } from "next";
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

export function resolvePageMeta(
  settings: SeoSettings,
  page: SeoFields,
  path: string,
  type: "website" | "article" = "website",
): ResolvedSeo {
  const pageTitle = page.title?.trim() || settings.siteName;
  const title =
    page.title != null && page.title !== ""
      ? formatTitle(settings.titleTemplate, pageTitle, settings.siteName)
      : settings.siteName;

  const description = page.description?.trim() || settings.defaultDescription;
  const canonical = page.canonical?.trim() || `${settings.siteUrl}${path}`;
  const ogImage = page.ogImage ?? settings.defaultOgImage;
  const images = ogImage ? [{ url: ogImage }] : [];

  return {
    title,
    description,
    canonical,
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

export function toMetadata(resolved: ResolvedSeo): Metadata {
  return {
    title: resolved.title,
    description: resolved.description,
    alternates: { canonical: resolved.canonical },
    robots: resolved.robots,
    openGraph: resolved.openGraph,
    twitter: resolved.twitter,
  };
}
