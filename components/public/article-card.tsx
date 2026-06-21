import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Badge } from "@/components/public/badge";
import { Card } from "@/components/public/card";
import { SectionHeader } from "@/components/public/section-header";
import type { Article } from "@/lib/schemas/article";
import { formatArticleDate } from "@/lib/utils/format-date";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const { label, datetime } = formatArticleDate(article.publishedAt);
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
        {article.readingTimeMin ? (
          <span className="text-text-muted text-xs">
            · {article.readingTimeMin} min
          </span>
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
        Leer nota
        <span aria-hidden="true">→</span>
      </Link>
    </Card>
  );
}

type LatestArticlesProps = {
  articles: Article[];
};

export function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section
      id="lab"
      aria-labelledby="latest-articles-heading"
      className="mb-section-gap-mobile md:mb-section-gap scroll-mt-28"
    >
      <RevealOnScroll>
        <SectionHeader
          label="The Lab"
          title="Notas técnicas y exploración"
          description="Reflexiones sobre arquitectura, sistemas y la intersección entre ciencia y código."
          href="/blog"
          linkLabel="Ver blog →"
        />
      </RevealOnScroll>
      <h2 id="latest-articles-heading" className="sr-only">
        Últimos artículos
      </h2>

      {articles.length === 0 ? (
        <p className="text-text-secondary text-sm">
          Aún no hay artículos publicados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <RevealOnScroll key={article.id} delay={index * 80}>
              <ArticleCard article={article} />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </section>
  );
}
