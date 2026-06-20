export const CACHE_TAGS = {
  home: "home",
  pageContent: "page-content",
  experience: "experience",
  projects: "projects",
  articles: "articles",
  seo: "seo",
  project: (slug: string) => `project:${slug}`,
  article: (slug: string) => `article:${slug}`,
} as const;

export type RevalidateEntity =
  | "home"
  | "page-content"
  | "experience"
  | "projects"
  | "project"
  | "articles"
  | "article"
  | "seo";

type RevalidateOptions = {
  slug?: string;
};

const ENTITY_TAGS: Record<
  RevalidateEntity,
  (options?: RevalidateOptions) => string[]
> = {
  home: () => [CACHE_TAGS.home],
  "page-content": () => [CACHE_TAGS.home, CACHE_TAGS.pageContent],
  experience: () => [CACHE_TAGS.experience, CACHE_TAGS.home],
  projects: () => [CACHE_TAGS.projects, CACHE_TAGS.home],
  project: (options) => [
    CACHE_TAGS.projects,
    CACHE_TAGS.home,
    ...(options?.slug ? [CACHE_TAGS.project(options.slug)] : []),
  ],
  articles: () => [CACHE_TAGS.articles, CACHE_TAGS.home],
  article: (options) => [
    CACHE_TAGS.articles,
    CACHE_TAGS.home,
    ...(options?.slug ? [CACHE_TAGS.article(options.slug)] : []),
  ],
  seo: () => [CACHE_TAGS.seo],
};

export function getTagsForEntity(
  entity: RevalidateEntity,
  options?: RevalidateOptions,
): string[] {
  return [...new Set(ENTITY_TAGS[entity](options))];
}

export async function revalidateEntity(
  entity: RevalidateEntity,
  options?: RevalidateOptions,
): Promise<void> {
  const { revalidateTag } = await import("next/cache");
  for (const tag of getTagsForEntity(entity, options)) {
    revalidateTag(tag, "max");
  }
}
