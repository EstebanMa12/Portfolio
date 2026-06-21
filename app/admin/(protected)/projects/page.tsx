import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/public/section-label";
import * as projectRepo from "@/lib/repositories/project-repo";

export default async function AdminProjectsPage() {
  const projects = await projectRepo.getAllAdmin();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary">
            Proyectos
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Gestiona case studies, galería de imágenes y publicación.
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary text-sm px-5 min-h-10">
          Nuevo proyecto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-surface/80 text-left text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Miniatura</th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Locale</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Destacado</th>
              <th className="px-4 py-3 font-medium">Orden</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-muted">
                  No hay proyectos todavía.
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const thumbnail = project.images[0]?.imageUrl;

                return (
                  <tr key={project.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      {thumbnail ? (
                        <div className="relative h-10 w-16 overflow-hidden rounded border border-border">
                          <Image
                            src={thumbnail}
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
                      {project.title}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {project.category}
                    </td>
                    <td className="px-4 py-3 uppercase text-text-secondary">
                      {project.locale}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          project.status === "published"
                            ? "text-accent"
                            : "text-text-muted"
                        }
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {project.featured ? "Sí" : "No"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {project.sortOrder}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-accent hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
