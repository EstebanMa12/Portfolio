import Link from "next/link";
import { ArticlesTable } from "@/components/admin/articles-table";
import { SectionLabel } from "@/components/public/section-label";
import * as articleRepo from "@/lib/repositories/article-repo";

export default async function AdminArticlesPage() {
  const articles = await articleRepo.getAllAdmin();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary">
            Artículos
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Gestiona posts del blog, portada y publicación.
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary text-sm px-5 min-h-10">
          Nuevo artículo
        </Link>
      </div>

      <ArticlesTable articles={articles} />
    </>
  );
}
