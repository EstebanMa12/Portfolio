import { cachedQuery, assertNoError, RepositoryError, unwrap } from "@/lib/repositories/base";
import { mapProjectWithTechnologies } from "@/lib/repositories/mappers";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import type {
  Project,
  ProjectInsert,
  ProjectWithTechnologies,
} from "@/lib/schemas/project";
import { projectSchema } from "@/lib/schemas/project";
import type { Database } from "@/types/database";

const WITH_TECH = `
  *,
  project_technologies (
    technologies (*)
  )
`;

async function fetchPublished(
  locale: Locale = defaultLocale,
): Promise<ProjectWithTechnologies[]> {
  const supabase = createStaticClient();
  const rows = unwrap(
    await supabase
      .from("projects")
      .select(WITH_TECH)
      .eq("status", "published")
      .eq("locale", locale)
      .order("sort_order", { ascending: true }),
  );

  return rows.map(mapProjectWithTechnologies);
}

async function fetchFeatured(
  limit = 3,
  locale: Locale = defaultLocale,
): Promise<ProjectWithTechnologies[]> {
  const supabase = createStaticClient();
  const rows = unwrap(
    await supabase
      .from("projects")
      .select(WITH_TECH)
      .eq("status", "published")
      .eq("featured", true)
      .eq("locale", locale)
      .order("sort_order", { ascending: true })
      .limit(limit),
  );

  return rows.map(mapProjectWithTechnologies);
}

async function fetchAllAdmin(): Promise<ProjectWithTechnologies[]> {
  const supabase = await createClient();
  const rows = unwrap(
    await supabase
      .from("projects")
      .select(WITH_TECH)
      .order("sort_order", { ascending: true }),
  );

  return rows.map(mapProjectWithTechnologies);
}

async function fetchBySlug(
  slug: string,
  admin = false,
  locale: Locale = defaultLocale,
): Promise<ProjectWithTechnologies | null> {
  const supabase = admin ? await createClient() : createStaticClient();
  let query = supabase.from("projects").select(WITH_TECH).eq("slug", slug);

  if (!admin) {
    query = query.eq("status", "published").eq("locale", locale);
  }

  const { data } = await query.maybeSingle();
  if (!data) return null;
  return mapProjectWithTechnologies(data);
}

async function fetchById(
  id: string,
  admin = false,
): Promise<ProjectWithTechnologies | null> {
  const supabase = admin ? await createClient() : createStaticClient();
  let query = supabase.from("projects").select(WITH_TECH).eq("id", id);

  if (!admin) {
    query = query.eq("status", "published");
  }

  const { data } = await query.maybeSingle();
  if (!data) return null;
  return mapProjectWithTechnologies(data);
}

export const getPublished = cachedQuery(fetchPublished);
export const getFeatured = cachedQuery(fetchFeatured);
export const getAllAdmin = cachedQuery(fetchAllAdmin);

export async function getBySlug(
  slug: string,
  admin = false,
  locale: Locale = defaultLocale,
): Promise<ProjectWithTechnologies | null> {
  return fetchBySlug(slug, admin, locale);
}

export async function getById(
  id: string,
  admin = false,
): Promise<ProjectWithTechnologies | null> {
  return fetchById(id, admin);
}

export async function getPublishedSlugs(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  const supabase = await createClient();
  const rows = unwrap(
    await supabase
      .from("projects")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
  );

  return rows.map((row) => ({
    slug: row.slug,
    updatedAt: row.updated_at,
  }));
}

async function syncTechnologies(
  projectId: string,
  technologyIds: string[],
): Promise<void> {
  const supabase = await createClient();

  unwrap(
    await supabase
      .from("project_technologies")
      .delete()
      .eq("project_id", projectId),
  );

  if (technologyIds.length === 0) return;

  unwrap(
    await supabase.from("project_technologies").insert(
      technologyIds.map((technologyId) => ({
        project_id: projectId,
        technology_id: technologyId,
      })),
    ),
  );
}

export async function create(
  input: ProjectInsert,
): Promise<ProjectWithTechnologies> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: input.title,
      slug: input.slug,
      category: input.category,
      problem: input.problem,
      solution: input.solution,
      result: input.result,
      content: input.content ?? null,
      github_url: input.githubUrl ?? null,
      demo_url: input.demoUrl ?? null,
      cover_image_url: input.coverImageUrl ?? null,
      featured: input.featured,
      status: input.status,
      sort_order: input.sortOrder,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new RepositoryError(
      error?.message ?? "Failed to create project",
      "QUERY_FAILED",
      error,
    );
  }

  await syncTechnologies(data.id, input.technologyIds);
  const created = await fetchById(data.id, true);
  if (!created) throw new Error("Failed to load created project");
  return created;
}

export async function update(
  id: string,
  input: Partial<ProjectInsert> & {
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoOgImage?: string | null;
    seoCanonical?: string | null;
    seoNoindex?: boolean;
  },
): Promise<ProjectWithTechnologies> {
  const supabase = await createClient();
  const patch: Database["public"]["Tables"]["projects"]["Update"] = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.category !== undefined) patch.category = input.category;
  if (input.problem !== undefined) patch.problem = input.problem;
  if (input.solution !== undefined) patch.solution = input.solution;
  if (input.result !== undefined) patch.result = input.result;
  if (input.content !== undefined) patch.content = input.content;
  if (input.githubUrl !== undefined) patch.github_url = input.githubUrl;
  if (input.demoUrl !== undefined) patch.demo_url = input.demoUrl;
  if (input.coverImageUrl !== undefined) patch.cover_image_url = input.coverImageUrl;
  if (input.featured !== undefined) patch.featured = input.featured;
  if (input.status !== undefined) patch.status = input.status;
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;
  if (input.seoTitle !== undefined) patch.seo_title = input.seoTitle;
  if (input.seoDescription !== undefined) patch.seo_description = input.seoDescription;
  if (input.seoOgImage !== undefined) patch.seo_og_image = input.seoOgImage;
  if (input.seoCanonical !== undefined) patch.seo_canonical = input.seoCanonical;
  if (input.seoNoindex !== undefined) patch.seo_noindex = input.seoNoindex;

  if (Object.keys(patch).length > 0) {
    assertNoError(await supabase.from("projects").update(patch).eq("id", id));
  }

  if (input.technologyIds !== undefined) {
    await syncTechnologies(id, input.technologyIds);
  }

  const updated = await fetchById(id, true);
  if (!updated) throw new Error("Failed to load updated project");
  return updated;
}

export async function remove(id: string): Promise<void> {
  const supabase = await createClient();
  assertNoError(await supabase.from("projects").delete().eq("id", id));
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("projects").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.maybeSingle();
  return data !== null;
}

export function toProject(entity: ProjectWithTechnologies): Project {
  const { technologies, ...project } = entity;
  void technologies;
  return projectSchema.parse(project);
}
