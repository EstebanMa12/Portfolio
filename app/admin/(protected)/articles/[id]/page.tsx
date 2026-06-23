import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { SectionLabel } from "@/components/public/section-label";
import * as articleRepo from "@/lib/repositories/article-repo";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function EditArticlePage({
  params,
  searchParams,
}: EditArticlePageProps) {
  const { id } = await params;
  const { created } = await searchParams;

  const article = await articleRepo.getById(id, true);
  if (!article) notFound();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-2">
        Editar artículo
      </h1>
      <p className="text-sm text-text-secondary mb-8">{article.title}</p>
      {created ? (
        <p className="mb-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Artículo creado. Puedes seguir editando o publicarlo.
        </p>
      ) : null}
      <ArticleForm article={article} />
    </>
  );
}
