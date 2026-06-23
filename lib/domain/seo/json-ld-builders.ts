import type { Locale } from "@/lib/i18n/config";
import type { Article } from "@/lib/schemas/article";
import type { Experience } from "@/lib/schemas/experience";
import type { AboutContent, HeroContent } from "@/lib/schemas/page-content";

type JsonLdObject = Record<string, unknown>;

function withContext(data: JsonLdObject): JsonLdObject {
  return { "@context": "https://schema.org", ...data };
}

function personNode(input: {
  name: string;
  url: string;
  jobTitle?: string;
  description?: string;
  knowsAbout?: string[];
  sameAs?: string[];
  locale: Locale;
}): JsonLdObject {
  return {
    "@type": "Person",
    name: input.name,
    url: input.url,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.knowsAbout?.length ? { knowsAbout: input.knowsAbout } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
    inLanguage: input.locale,
  };
}

function webSiteNode(input: {
  name: string;
  url: string;
  locale: Locale;
}): JsonLdObject {
  return {
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    inLanguage: input.locale,
  };
}

export function buildPersonJsonLd(input: {
  name: string;
  url: string;
  jobTitle?: string;
  description?: string;
  knowsAbout?: string[];
  sameAs?: string[];
  locale: Locale;
}): JsonLdObject {
  return withContext(personNode(input));
}

export function buildWebSiteJsonLd(input: {
  name: string;
  url: string;
  locale: Locale;
}): JsonLdObject {
  return withContext(webSiteNode(input));
}

export function buildHomeJsonLd(input: {
  hero: HeroContent;
  siteName: string;
  siteUrl: string;
  pageUrl: string;
  locale: Locale;
}): JsonLdObject {
  return withContext({
    "@graph": [
      personNode({
        name: input.hero.name,
        url: input.pageUrl,
        jobTitle: input.hero.headline,
        sameAs: [
          input.hero.socialLinks.github,
          input.hero.socialLinks.linkedin,
        ],
        locale: input.locale,
      }),
      webSiteNode({
        name: input.siteName,
        url: input.pageUrl,
        locale: input.locale,
      }),
    ],
  });
}

export function buildAboutPersonJsonLd(input: {
  hero: HeroContent | null;
  about: AboutContent;
  siteName: string;
  pageUrl: string;
  locale: Locale;
}): JsonLdObject {
  return withContext(personNode({
    name: input.hero?.name ?? input.siteName,
    url: input.pageUrl,
    description: input.about.paragraphs.join(" "),
    knowsAbout: input.about.interests,
    locale: input.locale,
  }));
}

export function buildProfilePageJsonLd(input: {
  hero: HeroContent;
  experiences: Experience[];
  pageUrl: string;
  locale: Locale;
}): JsonLdObject {
  return withContext({
    "@type": "ProfilePage",
    url: input.pageUrl,
    inLanguage: input.locale,
    mainEntity: {
      "@type": "Person",
      name: input.hero.name,
      url: input.pageUrl,
      jobTitle: input.hero.headline,
      hasOccupation: input.experiences.map((experience) => ({
        "@type": "Occupation",
        name: experience.role,
        occupationalCategory: experience.company,
        startDate: experience.startDate,
        ...(experience.endDate ? { endDate: experience.endDate } : {}),
      })),
    },
  });
}

export function buildBlogPostingJsonLd(input: {
  article: Article;
  authorName: string;
  pageUrl: string;
  locale: Locale;
}): JsonLdObject {
  const { article } = input;
  const image = article.seoOgImage ?? article.coverImageUrl;

  return withContext({
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: input.locale,
    ...(image ? { image } : {}),
    ...(article.readingTimeMin
      ? { timeRequired: `PT${article.readingTimeMin}M` }
      : {}),
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    url: input.pageUrl,
  });
}
