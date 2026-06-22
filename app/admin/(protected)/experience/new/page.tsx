import { ExperienceForm } from "@/components/admin/experience-form";
import { SectionLabel } from "@/components/public/section-label";
import * as technologyRepo from "@/lib/repositories/technology-repo";

export default async function NewExperiencePage() {
  const technologies = await technologyRepo.getAll();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-8">
        Nueva experiencia
      </h1>
      <ExperienceForm technologies={technologies} />
    </>
  );
}
