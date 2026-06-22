import Link from "next/link";
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

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-surface/80 text-left text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Periodo</th>
              <th className="px-4 py-3 font-medium">Stack</th>
              <th className="px-4 py-3 font-medium">Orden</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {experiences.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                  No hay experiencias registradas.
                </td>
              </tr>
            ) : (
              experiences.map((experience) => (
                <tr key={experience.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {experience.company}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{experience.role}</td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {formatPeriod(experience.startDate, experience.endDate)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {experience.technologies.length > 0
                      ? experience.technologies.map((tech) => tech.name).join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{experience.sortOrder}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/experience/${experience.id}`}
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

function formatPeriod(startDate: string, endDate: string | null): string {
  const start = startDate.slice(0, 7);
  const end = endDate ? endDate.slice(0, 7) : "actual";
  return `${start} → ${end}`;
}
