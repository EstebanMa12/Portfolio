import { Link } from "@/lib/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in-view";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Badge } from "@/components/public/badge";
import { Card } from "@/components/public/card";
import { SectionHeader } from "@/components/public/section-header";
import type { Article } from "@/lib/schemas/article";
import type { Locale } from "@/lib/i18n/config";
import { formatArticleDate } from "@/lib/utils/format-date";

type ArticleCardProps = {
  article: Article;
  readMoreLabel: string;
  locale: Locale;
  noDateLabel: string;
  readingTimeLabel?: string;
};

export function ArticleCard({
  article,
  readMoreLabel,
  locale,
  noDateLabel,
  readingTimeLabel,
}: Readonly<ArticleCardProps>) {
  const { label, datetime } = formatArticleDate(
    article.publishedAt,
    locale,
    noDateLabel,
  );
  const primaryTag = article.tags[0];

  return (
    <Card as="article" interactive className="lab-card flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        {primaryTag ? <Badge>{primaryTag}</Badge> : null}
        {datetime ? (
          <time className="text-text-muted text-xs" dateTime={datetime}>
            {label}
          </time>
        ) : null}
        {readingTimeLabel ? (
          <span className="text-text-muted text-xs">· {readingTimeLabel}</span>
        ) : null}
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-2 leading-snug">
        <Link
          href={`/blog/${article.slug}`}
          className="hover:text-accent transition-colors"
        >
          {article.title}
        </Link>
      </h3>

      <p className="text-text-secondary text-sm leading-relaxed flex-1">
        {article.excerpt}
      </p>

      <Link
        href={`/blog/${article.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-text-primary transition-colors mt-4 pt-4 border-t border-border"
      >
        {readMoreLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </Card>
  );
}

type LatestArticlesProps = {
  articles: Article[];
};

export async function LatestArticles({ articles }: LatestArticlesProps) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("sections");
  const tBlog = await getTranslations("blog");

  return (
    <section
      id="lab"
      aria-labelledby="latest-articles-heading"
      className="mb-section-gap-mobile md:mb-section-gap scroll-mt-28"
    >
      <RevealOnScroll>
        <SectionHeader
          label={t("labLabel")}
          title={t("labTitle")}
          description={t("labDescription")}
          href="/blog"
          linkLabel={t("labLink")}
        />
      </RevealOnScroll>
      <h2 id="latest-articles-heading" className="sr-only">
        {t("labTitle")}
      </h2>

      {articles.length === 0 ? (
        <p className="text-text-secondary text-sm">{tBlog("empty")}</p>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <StaggerItem key={article.id}>
              <ArticleCard
                article={article}
                readMoreLabel={tBlog("readMore")}
                locale={locale}
                noDateLabel={tBlog("noDate")}
                readingTimeLabel={
                  article.readingTimeMin
                    ? tBlog("readingTime", { minutes: article.readingTimeMin })
                    : undefined
                }
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}
