import { unstable_cache } from "next/cache";
import * as articleRepo from "@/lib/repositories/article-repo";
import * as experienceRepo from "@/lib/repositories/experience-repo";
import * as pageContentRepo from "@/lib/repositories/page-content-repo";
import * as projectRepo from "@/lib/repositories/project-repo";
import { CACHE_TAGS } from "@/lib/revalidate";

export const REVALIDATE_SECONDS = 3600;
export const ARTICLE_REVALIDATE_SECONDS = 86400;

export const getHeroContent = unstable_cache(
  () => pageContentRepo.getHero(),
  ["public-hero"],
  {
    tags: [CACHE_TAGS.home, CACHE_TAGS.pageContent],
    revalidate: REVALIDATE_SECONDS,
  },
);

export const getAboutContent = unstable_cache(
  () => pageContentRepo.getAbout(),
  ["public-about"],
  {
    tags: [CACHE_TAGS.pageContent],
    revalidate: REVALIDATE_SECONDS,
  },
);

export const getContactContent = unstable_cache(
  () => pageContentRepo.getContact(),
  ["public-contact"],
  {
    tags: [CACHE_TAGS.pageContent],
    revalidate: REVALIDATE_SECONDS,
  },
);

export const getAchievementsContent = unstable_cache(
  () => pageContentRepo.getAchievements(),
  ["public-achievements"],
  {
    tags: [CACHE_TAGS.pageContent, CACHE_TAGS.home],
    revalidate: REVALIDATE_SECONDS,
  },
);

export const getFeaturedProjects = unstable_cache(
  () => projectRepo.getFeatured(3),
  ["public-featured-projects"],
  {
    tags: [CACHE_TAGS.projects, CACHE_TAGS.home],
    revalidate: REVALIDATE_SECONDS,
  },
);

export const getLatestArticles = unstable_cache(
  () => articleRepo.getLatest(3),
  ["public-latest-articles"],
  {
    tags: [CACHE_TAGS.articles, CACHE_TAGS.home],
    revalidate: REVALIDATE_SECONDS,
  },
);

export const getAllExperiences = unstable_cache(
  () => experienceRepo.getAllPublic(),
  ["public-experiences"],
  {
    tags: [CACHE_TAGS.experience],
    revalidate: REVALIDATE_SECONDS,
  },
);

export const getPublishedProjects = unstable_cache(
  () => projectRepo.getPublished(),
  ["public-projects"],
  {
    tags: [CACHE_TAGS.projects],
    revalidate: REVALIDATE_SECONDS,
  },
);

export function getPublishedArticles(page = 1, pageSize = 9) {
  return unstable_cache(
    () => articleRepo.getPublishedPaginated(page, pageSize),
    ["public-articles", String(page), String(pageSize)],
    {
      tags: [CACHE_TAGS.articles],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getArticleBySlug(slug: string) {
  return unstable_cache(
    () => articleRepo.getBySlug(slug),
    ["public-article", slug],
    {
      tags: [CACHE_TAGS.articles, CACHE_TAGS.article(slug)],
      revalidate: ARTICLE_REVALIDATE_SECONDS,
    },
  )();
}

export const getArticleSlugs = unstable_cache(
  () => articleRepo.getPublishedSlugs(),
  ["public-article-slugs"],
  {
    tags: [CACHE_TAGS.articles],
    revalidate: REVALIDATE_SECONDS,
  },
);
