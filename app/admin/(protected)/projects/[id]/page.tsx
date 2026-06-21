import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { SectionLabel } from "@/components/public/section-label";
import * as projectRepo from "@/lib/repositories/project-repo";
import * as technologyRepo from "@/lib/repositories/technology-repo";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function EditProjectPage({
  params,
  searchParams,
}: EditProjectPageProps) {
  const { id } = await params;
  const { created } = await searchParams;

  const [project, technologies] = await Promise.all([
    projectRepo.getById(id, true),
    technologyRepo.getAll(),
  ]);

  if (!project) notFound();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-2">
        Editar proyecto
      </h1>
      <p className="text-sm text-text-secondary mb-8">{project.title}</p>
      {created ? (
        <p className="mb-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Proyecto creado. Puedes seguir editando o publicarlo.
        </p>
      ) : null}
      <ProjectForm project={project} technologies={technologies} />
    </>
  );
}
