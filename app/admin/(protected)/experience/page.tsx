import Link from "next/link";
import { ExperienceTable } from "@/components/admin/experience-table";
import { SectionLabel } from "@/components/public/section-label";
import * as experienceRepo from "@/lib/repositories/experience-repo";

export default async function AdminExperiencePage() {
  const experiences = await experienceRepo.getAllAdmin();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary">
            Experiencia
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Timeline laboral ordenado por sort_order.
          </p>
        </div>
        <Link href="/admin/experience/new" className="btn-primary text-sm px-5 min-h-10">
          Nueva experiencia
        </Link>
      </div>

      <ExperienceTable experiences={experiences} />
    </>
  );
}
