import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/experience-form";
import { SectionLabel } from "@/components/public/section-label";
import * as experienceRepo from "@/lib/repositories/experience-repo";
import * as technologyRepo from "@/lib/repositories/technology-repo";

type EditExperiencePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function EditExperiencePage({
  params,
  searchParams,
}: EditExperiencePageProps) {
  const { id } = await params;
  const { created } = await searchParams;

  const [experience, technologies] = await Promise.all([
    experienceRepo.getById(id, true),
    technologyRepo.getAll(),
  ]);

  if (!experience) notFound();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-2">
        Editar experiencia
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        {experience.role} · {experience.company}
      </p>
      {created ? (
        <p className="mb-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Experiencia creada. Puedes seguir editando.
        </p>
      ) : null}
      <ExperienceForm experience={experience} technologies={technologies} />
    </>
  );
}
