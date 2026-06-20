import type { Metadata } from "next";
import { PLACEHOLDER_PAGES } from "@/lib/config/site";
import { resolvePageMeta, toMetadata } from "@/lib/domain/seo/seo-service";
import type { SeoFields } from "@/lib/domain/seo/types";
import { getSettings } from "@/lib/repositories/seo-repo";

export async function createPageMetadata(
  path: keyof typeof PLACEHOLDER_PAGES,
  overrides: SeoFields = {},
): Promise<Metadata> {
  const settings = await getSettings();
  const page = PLACEHOLDER_PAGES[path];

  return toMetadata(
    resolvePageMeta(
      settings,
      {
        title: page.title,
        description: page.description,
        ...overrides,
      },
      path,
    ),
  );
}
