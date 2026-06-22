import Image from "next/image";
import Link from "next/link";
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

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-surface/80 text-left text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Portada</th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Locale</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Publicado</th>
              <th className="px-4 py-3 font-medium">Lectura</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                  No hay artículos todavía.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    {article.coverImageUrl ? (
                      <div className="relative h-10 w-16 overflow-hidden rounded border border-border">
                        <Image
                          src={article.coverImageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {article.title}
                  </td>
                  <td className="px-4 py-3 uppercase text-text-secondary">
                    {article.locale}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        article.status === "published"
                          ? "text-accent"
                          : "text-text-muted"
                      }
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("es-ES")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {article.readingTimeMin ? `${article.readingTimeMin} min` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-accent hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
