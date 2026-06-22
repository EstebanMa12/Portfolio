import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ArticleCard } from "@/components/public/article-card";
import { PageCta } from "@/components/public/page-cta";
import { PageHeader } from "@/components/public/page-header";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/fade-in-view";
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
  const tCta = await getTranslations({ locale, namespace: "cta" });

  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const { items, totalPages, total } = await getPublishedArticles(page, 9, locale);

  return (
    <section aria-labelledby="blog-heading" className="py-8">
      <PageHeader
        label={tSections("labLabel")}
        title={tSections("labTitle")}
        description={tSections("labDescription")}
        headingId="blog-heading"
      />

      {items.length === 0 ? (
        <p className="text-text-secondary text-sm">{t("empty")}</p>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((article) => (
            <StaggerItem key={article.id}>
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
            </StaggerItem>
          ))}
        </StaggerContainer>
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

      <PageCta
        title={tCta("nextStep")}
        description={tCta("blogDescription")}
        primaryHref="/contact"
        primaryLabel={tCta("contact")}
        secondaryHref="/projects"
        secondaryLabel={tCta("viewProjects")}
      />
    </section>
  );
}
