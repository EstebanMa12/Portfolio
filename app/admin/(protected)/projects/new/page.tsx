import { ProjectForm } from "@/components/admin/project-form";
import { SectionLabel } from "@/components/public/section-label";
import * as technologyRepo from "@/lib/repositories/technology-repo";

export default async function NewProjectPage() {
  const technologies = await technologyRepo.getAll();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-8">
        Nuevo proyecto
      </h1>
      <ProjectForm technologies={technologies} />
    </>
  );
}
