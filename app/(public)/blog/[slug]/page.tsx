import type { Metadata } from "next";
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
import { resolvePageMeta, toMetadata } from "@/lib/domain/seo/seo-service";
import { getSettings } from "@/lib/repositories/seo-repo";
import { formatArticleDate } from "@/lib/utils/format-date";

export const revalidate = 86400;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [article, settings] = await Promise.all([
    getArticleBySlug(slug),
    getSettings(),
  ]);

  if (!article) {
    return {};
  }

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
      `/blog/${article.slug}`,
      "article",
    ),
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, hero, settings] = await Promise.all([
    getArticleBySlug(slug),
    getHeroContent(),
    getSettings(),
  ]);

  if (!article) {
    notFound();
  }

  const { label, datetime } = formatArticleDate(article.publishedAt);

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
          author: {
            "@type": "Person",
            name: hero?.name ?? settings.siteName,
          },
          url: `${settings.siteUrl}/blog/${article.slug}`,
        }}
      />

      <RevealOnScroll direction="none">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Blog", href: "/blog" },
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
                · {article.readingTimeMin} min de lectura
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
