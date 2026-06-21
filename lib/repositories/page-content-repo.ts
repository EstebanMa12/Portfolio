import { cache } from "react";
import {
  pageContentSchemas,
  type PageContentId,
  type PageContentMap,
} from "@/lib/schemas/page-content";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import { RepositoryError, unwrap, unwrapOptional } from "./base";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";

async function fetchById<T extends PageContentId>(
  id: T,
  locale: Locale = defaultLocale,
): Promise<PageContentMap[T] | null> {
  const supabase = createStaticClient();
  const result = await supabase
    .from("page_content")
    .select("data")
    .eq("id", id)
    .eq("locale", locale)
    .maybeSingle();

  const row = unwrapOptional(result);
  if (!row) return null;

  return pageContentSchemas[id].parse(row.data) as PageContentMap[T];
}

export const getById = cache(fetchById);

export async function getByIdOrThrow<T extends PageContentId>(
  id: T,
  locale: Locale = defaultLocale,
): Promise<PageContentMap[T]> {
  const content = await getById(id, locale);
  if (!content) {
    throw new RepositoryError(`Page content "${id}" not found`, "NOT_FOUND");
  }
  return content;
}

export async function updateById<T extends PageContentId>(
  id: T,
  data: PageContentMap[T],
  locale: Locale = defaultLocale,
): Promise<PageContentMap[T]> {
  const parsed = pageContentSchemas[id].parse(data) as PageContentMap[T];
  const supabase = await createClient();

  unwrap(
    await supabase
      .from("page_content")
      .update({ data: parsed })
      .eq("id", id)
      .eq("locale", locale)
      .select("data")
      .single(),
  );

  return parsed;
}

export const getHero = cache((locale: Locale = defaultLocale) =>
  fetchById("hero", locale),
);
export const getAbout = cache((locale: Locale = defaultLocale) =>
  fetchById("about", locale),
);
export const getContact = cache((locale: Locale = defaultLocale) =>
  fetchById("contact", locale),
);
export const getAchievements = cache((locale: Locale = defaultLocale) =>
  fetchById("achievements", locale),
);
