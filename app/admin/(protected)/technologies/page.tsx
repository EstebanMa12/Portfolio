import { TechnologyAdminPanel } from "@/components/admin/technology-admin-panel";
import { SectionLabel } from "@/components/public/section-label";
import * as technologyRepo from "@/lib/repositories/technology-repo";

export default async function AdminTechnologiesPage() {
  const technologies = await technologyRepo.getAll();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-text-primary">
          Tecnologías
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Catálogo de stack usado en experiencia y proyectos.
        </p>
      </div>

      <TechnologyAdminPanel technologies={technologies} />
    </>
  );
}
