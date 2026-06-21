import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/public/author-box";
import { Badge } from "@/components/public/badge";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getArticleBySlug,
  getArticleSlugs,
  getHeroContent,
} from "@/lib/cache/public-queries";
import { MarkdownContent } from "@/lib/markdown/render";
import {
  resolvePageMeta,
  toMetadata,
} from "@/lib/domain/seo/seo-service";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import { routing } from "@/lib/i18n/routing";
import { getSettings } from "@/lib/repositories/seo-repo";
import { formatArticleDate } from "@/lib/utils/format-date";

export const revalidate = 86400;

type ArticlePageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) => {
      const slugs = await getArticleSlugs(locale);
      return slugs.map(({ slug }) => ({ locale, slug }));
    }),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const [article, settings] = await Promise.all([
    getArticleBySlug(slug, locale),
    getSettings(locale),
  ]);

  if (!article) {
    return {};
  }

  const path = `/blog/${article.slug}`;
  const canonicalPath = localizedPath(path, locale);

  return toMetadata(
    resolvePageMeta(
      settings,
      {
        title: article.seoTitle ?? article.title,
        description: article.seoDescription ?? article.excerpt,
        ogImage: article.seoOgImage ?? article.coverImageUrl,
        canonical: article.seoCanonical,
        noindex: article.seoNoindex,
      },
      canonicalPath,
      "article",
      path,
    ),
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tA11y = await getTranslations({ locale, namespace: "a11y" });
  const tBlog = await getTranslations({ locale, namespace: "blog" });

  const [article, hero, settings] = await Promise.all([
    getArticleBySlug(slug, locale),
    getHeroContent(locale),
    getSettings(locale),
  ]);

  if (!article) {
    notFound();
  }

  const { label, datetime } = formatArticleDate(
    article.publishedAt,
    locale,
    tBlog("noDate"),
  );
  const articlePath = localizedPath(`/blog/${article.slug}`, locale);

  return (
    <article className="py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          inLanguage: locale,
          author: {
            "@type": "Person",
            name: hero?.name ?? settings.siteName,
          },
          url: `${settings.siteUrl}${articlePath}`,
        }}
      />

      <RevealOnScroll direction="none">
        <Breadcrumbs
          ariaLabel={tA11y("breadcrumb")}
          items={[
            { label: t("home"), href: "/" },
            { label: t("blog"), href: "/blog" },
            { label: article.title },
          ]}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={80}>
        <header className="mb-8 max-w-prose">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            {datetime ? (
              <time className="text-text-muted text-sm" dateTime={datetime}>
                {label}
              </time>
            ) : null}
            {article.readingTimeMin ? (
              <span className="text-text-muted text-sm">
                · {tBlog("readingTime", { minutes: article.readingTimeMin })}
              </span>
            ) : null}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            {article.excerpt}
          </p>
        </header>
      </RevealOnScroll>

      <RevealOnScroll delay={160}>
        <MarkdownContent content={article.content} />
      </RevealOnScroll>

      <RevealOnScroll delay={240}>
        <AuthorBox name={hero?.name ?? settings.siteName} bio={hero?.bio} />
      </RevealOnScroll>
    </article>
  );
}
