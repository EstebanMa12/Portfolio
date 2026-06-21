import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import * as articleRepo from "@/lib/repositories/article-repo";
import * as experienceRepo from "@/lib/repositories/experience-repo";
import * as pageContentRepo from "@/lib/repositories/page-content-repo";
import * as projectRepo from "@/lib/repositories/project-repo";
import { CACHE_TAGS } from "@/lib/revalidate";

export const REVALIDATE_SECONDS = 3600;
export const ARTICLE_REVALIDATE_SECONDS = 86400;

export function getHeroContent(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => pageContentRepo.getHero(locale),
    ["public-hero", locale],
    {
      tags: [CACHE_TAGS.home, CACHE_TAGS.pageContent],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getAboutContent(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => pageContentRepo.getAbout(locale),
    ["public-about", locale],
    {
      tags: [CACHE_TAGS.pageContent],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getContactContent(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => pageContentRepo.getContact(locale),
    ["public-contact", locale],
    {
      tags: [CACHE_TAGS.pageContent],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getAchievementsContent(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => pageContentRepo.getAchievements(locale),
    ["public-achievements", locale],
    {
      tags: [CACHE_TAGS.pageContent, CACHE_TAGS.home],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getFeaturedProjects(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => projectRepo.getFeatured(3, locale),
    ["public-featured-projects-v2", locale],
    {
      tags: [CACHE_TAGS.projects, CACHE_TAGS.home],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getLatestArticles(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => articleRepo.getLatest(3, locale),
    ["public-latest-articles", locale],
    {
      tags: [CACHE_TAGS.articles, CACHE_TAGS.home],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getAllExperiences(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => experienceRepo.getAllPublic(locale),
    ["public-experiences", locale],
    {
      tags: [CACHE_TAGS.experience],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getPublishedProjects(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => projectRepo.getPublished(locale),
    ["public-projects-v2", locale],
    {
      tags: [CACHE_TAGS.projects],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getPublishedArticles(
  page = 1,
  pageSize = 9,
  locale: Locale = defaultLocale,
) {
  return unstable_cache(
    () => articleRepo.getPublishedPaginated(page, pageSize, locale),
    ["public-articles", locale, String(page), String(pageSize)],
    {
      tags: [CACHE_TAGS.articles],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getArticleBySlug(slug: string, locale: Locale = defaultLocale) {
  return unstable_cache(
    () => articleRepo.getBySlug(slug, false, locale),
    ["public-article", locale, slug],
    {
      tags: [CACHE_TAGS.articles, CACHE_TAGS.article(slug)],
      revalidate: ARTICLE_REVALIDATE_SECONDS,
    },
  )();
}

export function getArticleSlugs(locale: Locale = defaultLocale) {
  return unstable_cache(
    () => articleRepo.getPublishedSlugs(locale),
    ["public-article-slugs", locale],
    {
      tags: [CACHE_TAGS.articles],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}
