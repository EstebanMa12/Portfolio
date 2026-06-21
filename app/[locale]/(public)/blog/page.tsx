import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ArticleCard } from "@/components/public/article-card";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { getPublishedArticles } from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return createPageMetadata(locale, "/blog");
}

type BlogPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "blog" });
  const tSections = await getTranslations({ locale, namespace: "sections" });

  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const { items, totalPages, total } = await getPublishedArticles(page, 9, locale);

  return (
    <section aria-labelledby="blog-heading" className="py-8">
      <RevealOnScroll>
        <SectionLabel className="mb-3">{tSections("labLabel")}</SectionLabel>
        <h1
          id="blog-heading"
          className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary"
        >
          {tSections("labTitle")}
        </h1>
        <p className="mt-3 text-text-secondary max-w-prose leading-relaxed">
          {tSections("labDescription")}
        </p>
      </RevealOnScroll>

      {items.length === 0 ? (
        <p className="mt-10 text-text-secondary text-sm">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((article, index) => (
            <RevealOnScroll key={article.id} delay={index * 80}>
              <ArticleCard
                article={article}
                readMoreLabel={t("readMore")}
                locale={locale}
                noDateLabel={t("noDate")}
                readingTimeLabel={
                  article.readingTimeMin
                    ? t("readingTime", { minutes: article.readingTimeMin })
                    : undefined
                }
              />
            </RevealOnScroll>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <RevealOnScroll delay={120}>
          <nav
            aria-label={t("paginationAria")}
            className="mt-10 flex items-center justify-between gap-4 text-sm"
          >
            {page > 1 ? (
              <Link
                href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}
                className="text-accent hover:text-text-primary transition-colors"
              >
                ← {t("paginationPrev")}
              </Link>
            ) : (
              <span />
            )}
            <span className="text-text-muted">
              {t("pageOf", { page, total: totalPages })} · {total}
            </span>
            {page < totalPages ? (
              <Link
                href={`/blog?page=${page + 1}`}
                className="text-accent hover:text-text-primary transition-colors"
              >
                {t("paginationNext")} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </RevealOnScroll>
      ) : null}
    </section>
  );
}
