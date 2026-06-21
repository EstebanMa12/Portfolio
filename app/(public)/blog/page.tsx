import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/public/article-card";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import {
  getPublishedArticles,
} from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata("/blog", {
    title: "The Lab",
    description:
      "Notas técnicas sobre arquitectura, sistemas y la intersección entre ciencia y código.",
  });
}

type BlogPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const { items, totalPages, total } = await getPublishedArticles(page, 9);

  return (
    <section aria-labelledby="blog-heading" className="py-8">
      <RevealOnScroll>
        <SectionLabel className="mb-3">The Lab</SectionLabel>
        <h1
          id="blog-heading"
          className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary"
        >
          Notas técnicas y exploración
        </h1>
        <p className="mt-3 text-text-secondary max-w-prose leading-relaxed">
          Reflexiones sobre arquitectura, sistemas y la intersección entre ciencia
          y código.
        </p>
      </RevealOnScroll>

      {items.length === 0 ? (
        <p className="mt-10 text-text-secondary text-sm">
          Aún no hay artículos publicados.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((article, index) => (
            <RevealOnScroll key={article.id} delay={index * 80}>
              <ArticleCard article={article} />
            </RevealOnScroll>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <RevealOnScroll delay={120}>
          <nav
          aria-label="Paginación del blog"
          className="mt-10 flex items-center justify-between gap-4 text-sm"
        >
          {page > 1 ? (
            <Link
              href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}
              className="text-accent hover:text-text-primary transition-colors"
            >
              ← Anterior
            </Link>
          ) : (
            <span />
          )}
          <span className="text-text-muted">
            Página {page} de {totalPages} · {total} artículos
          </span>
          {page < totalPages ? (
            <Link
              href={`/blog?page=${page + 1}`}
              className="text-accent hover:text-text-primary transition-colors"
            >
              Siguiente →
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
