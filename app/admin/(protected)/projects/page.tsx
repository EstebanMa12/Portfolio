import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectsTable } from "@/components/admin/projects-table";
import {
  ProjectStatusFilterBar,
  type ProjectStatusFilter,
} from "@/components/admin/project-status-filter";
import { SectionLabel } from "@/components/public/section-label";
import * as projectRepo from "@/lib/repositories/project-repo";

const statusFilterSchema = z.enum(["all", "draft", "published"]);

type AdminProjectsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const { status: statusParam } = await searchParams;
  const parsed = statusFilterSchema.safeParse(statusParam ?? "all");
  if (!parsed.success) notFound();

  const statusFilter: ProjectStatusFilter = parsed.data;
  const allProjects = await projectRepo.getAllAdmin();
  const projects =
    statusFilter === "all"
      ? allProjects
      : allProjects.filter((project) => project.status === statusFilter);

  const emptyMessage =
    statusFilter === "all"
      ? "No hay proyectos todavía."
      : "No hay proyectos con este estado.";

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
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

      <ProjectStatusFilterBar current={statusFilter} />

      <ProjectsTable projects={projects} emptyMessage={emptyMessage} />
    </>
  );
}
