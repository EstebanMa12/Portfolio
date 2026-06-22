import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";
import { resolvePageMeta, toMetadata } from "@/lib/domain/seo/seo-service";
import type { SeoFields } from "@/lib/domain/seo/types";
import { getSettings } from "@/lib/repositories/seo-repo";

export type PublicPagePath =
  | "/"
  | "/about"
  | "/experience"
  | "/projects"
  | "/blog"
  | "/contact";

export async function createPageMetadata(
  locale: Locale,
  path: PublicPagePath,
  overrides: SeoFields = {},
): Promise<Metadata> {
  const [settings, t] = await Promise.all([
    getSettings(locale),
    getTranslations({ locale, namespace: "seo.pages" }),
  ]);

  const pageTitle = t(`${path}.title`);
  const pageDescription = t(`${path}.description`);

  return toMetadata(
    resolvePageMeta(
      settings,
      {
        title: pageTitle,
        description: pageDescription,
        ...overrides,
      },
      localizedPath(path, locale),
      "website",
      path,
    ),
    locale,
    path,
  );
}
