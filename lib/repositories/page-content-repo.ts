import { cache } from "react";
import {
  pageContentSchemas,
  type PageContentId,
  type PageContentMap,
} from "@/lib/schemas/page-content";
import { RepositoryError, unwrap, unwrapOptional } from "./base";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";

async function fetchById<T extends PageContentId>(
  id: T,
): Promise<PageContentMap[T] | null> {
  const supabase = createStaticClient();
  const result = await supabase
    .from("page_content")
    .select("data")
    .eq("id", id)
    .maybeSingle();

  const row = unwrapOptional(result);
  if (!row) return null;

  return pageContentSchemas[id].parse(row.data) as PageContentMap[T];
}

export const getById = cache(fetchById);

export async function getByIdOrThrow<T extends PageContentId>(
  id: T,
): Promise<PageContentMap[T]> {
  const content = await getById(id);
  if (!content) {
    throw new RepositoryError(`Page content "${id}" not found`, "NOT_FOUND");
  }
  return content;
}

export async function updateById<T extends PageContentId>(
  id: T,
  data: PageContentMap[T],
): Promise<PageContentMap[T]> {
  const parsed = pageContentSchemas[id].parse(data) as PageContentMap[T];
  const supabase = await createClient();

  unwrap(
    await supabase
      .from("page_content")
      .update({ data: parsed })
      .eq("id", id)
      .select("data")
      .single(),
  );

  return parsed;
}

export const getHero = cache(() => fetchById("hero"));
export const getAbout = cache(() => fetchById("about"));
export const getContact = cache(() => fetchById("contact"));
export const getAchievements = cache(() => fetchById("achievements"));
