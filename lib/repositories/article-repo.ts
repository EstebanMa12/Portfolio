import { cache } from "react";
import { assertNoError, unwrap } from "@/lib/repositories/base";
import { mapArticle } from "@/lib/repositories/mappers";
import { createClient } from "@/lib/supabase/server";
import type { Article, ArticleInsert } from "@/lib/schemas/article";
import { articleSchema } from "@/lib/schemas/article";
import type { Database } from "@/types/database";

const LIST_SELECT =
  "id, title, slug, excerpt, tags, cover_image_url, published_at, reading_time_min, status, updated_at, created_at, content, seo_title, seo_description, seo_og_image, seo_canonical, seo_noindex";

export type PaginatedArticles = {
  items: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

async function fetchPublishedPaginated(
  page = 1,
  pageSize = 9,
): Promise<PaginatedArticles> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("articles")
    .select(LIST_SELECT, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const total = count ?? 0;
  const items = (data ?? []).map((row) => articleSchema.parse(mapArticle(row)));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

async function fetchLatest(limit = 3): Promise<Article[]> {
  const supabase = await createClient();
  const rows = unwrap(
    await supabase
      .from("articles")
      .select(LIST_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit),
  );

  return rows.map((row) => articleSchema.parse(mapArticle(row)));
}

async function fetchAllAdmin(): Promise<Article[]> {
  const supabase = await createClient();
  const rows = unwrap(
    await supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false }),
  );

  return rows.map((row) => articleSchema.parse(mapArticle(row)));
}

async function fetchBySlug(
  slug: string,
  admin = false,
): Promise<Article | null> {
  const supabase = await createClient();
  let query = supabase.from("articles").select("*").eq("slug", slug);

  if (!admin) {
    query = query.eq("status", "published");
  }

  const { data } = await query.maybeSingle();
  if (!data) return null;
  return articleSchema.parse(mapArticle(data));
}

async function fetchById(id: string, admin = false): Promise<Article | null> {
  const supabase = await createClient();
  let query = supabase.from("articles").select("*").eq("id", id);

  if (!admin) {
    query = query.eq("status", "published");
  }

  const { data } = await query.maybeSingle();
  if (!data) return null;
  return articleSchema.parse(mapArticle(data));
}

export const getPublishedPaginated = cache(fetchPublishedPaginated);
export const getLatest = cache(fetchLatest);
export const getAllAdmin = cache(fetchAllAdmin);

export async function getBySlug(
  slug: string,
  admin = false,
): Promise<Article | null> {
  return fetchBySlug(slug, admin);
}

export async function getById(
  id: string,
  admin = false,
): Promise<Article | null> {
  return fetchById(id, admin);
}

export async function getPublishedSlugs(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  const supabase = await createClient();
  const rows = unwrap(
    await supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  );

  return rows.map((row) => ({
    slug: row.slug,
    updatedAt: row.updated_at,
  }));
}

export async function create(input: ArticleInsert): Promise<Article> {
  const supabase = await createClient();
  const row = unwrap(
    await supabase
      .from("articles")
      .insert({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        tags: input.tags,
        cover_image_url: input.coverImageUrl ?? null,
        status: input.status,
      })
      .select("*")
      .single(),
  );

  return articleSchema.parse(mapArticle(row));
}

export async function update(
  id: string,
  input: Partial<ArticleInsert> & {
    publishedAt?: string | null;
    readingTimeMin?: number | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoOgImage?: string | null;
    seoCanonical?: string | null;
    seoNoindex?: boolean;
  },
): Promise<Article> {
  const supabase = await createClient();
  const patch: Database["public"]["Tables"]["articles"]["Update"] = {};

  if (input.title !== undefined) patch.title = input.title;
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
  if (input.content !== undefined) patch.content = input.content;
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.coverImageUrl !== undefined) patch.cover_image_url = input.coverImageUrl;
  if (input.status !== undefined) patch.status = input.status;
  if (input.publishedAt !== undefined) patch.published_at = input.publishedAt;
  if (input.readingTimeMin !== undefined) patch.reading_time_min = input.readingTimeMin;
  if (input.seoTitle !== undefined) patch.seo_title = input.seoTitle;
  if (input.seoDescription !== undefined) patch.seo_description = input.seoDescription;
  if (input.seoOgImage !== undefined) patch.seo_og_image = input.seoOgImage;
  if (input.seoCanonical !== undefined) patch.seo_canonical = input.seoCanonical;
  if (input.seoNoindex !== undefined) patch.seo_noindex = input.seoNoindex;

  const row = unwrap(
    await supabase.from("articles").update(patch).eq("id", id).select("*").single(),
  );

  return articleSchema.parse(mapArticle(row));
}

export async function remove(id: string): Promise<void> {
  const supabase = await createClient();
  assertNoError(await supabase.from("articles").delete().eq("id", id));
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("articles").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.maybeSingle();
  return data !== null;
}
