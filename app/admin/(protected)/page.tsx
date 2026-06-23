import Link from "next/link";
import { SectionLabel } from "@/components/public/section-label";
import { requireAdmin } from "@/lib/auth/require-admin";
import { buildRecentActivity } from "@/lib/admin/recent-activity";
import * as articleRepo from "@/lib/repositories/article-repo";
import * as experienceRepo from "@/lib/repositories/experience-repo";
import * as projectRepo from "@/lib/repositories/project-repo";
import * as technologyRepo from "@/lib/repositories/technology-repo";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [projects, articles, experiences, technologies] = await Promise.all([
    projectRepo.getAllAdmin(),
    articleRepo.getAllAdmin(),
    experienceRepo.getAllAdmin(),
    technologyRepo.getAll(),
  ]);

  const draftProjects = projects.filter((project) => project.status === "draft").length;
  const draftArticles = articles.filter((article) => article.status === "draft").length;
  const recentActivity = buildRecentActivity({ projects, articles, experiences });

  const quickLinks = [
    { label: "Tecnologías", href: "/admin/technologies", count: technologies.length },
    { label: "Experiencia", href: "/admin/experience", count: experiences.length },
    { label: "Proyectos", href: "/admin/projects", count: projects.length },
    { label: "Artículos", href: "/admin/articles", count: articles.length },
    { label: "Páginas", href: "/admin/pages", count: 3 },
    { label: "Certificaciones", href: "/admin/certifications", count: null },
    { label: "SEO", href: "/admin/seo", count: null },
  ] as const;

  return (
    <section aria-labelledby="admin-heading">
      <SectionLabel className="mb-3">Panel</SectionLabel>
      <h1
        id="admin-heading"
        className="font-display text-3xl font-semibold text-text-primary"
      >
        Dashboard
      </h1>
      <p className="mt-3 text-text-secondary max-w-prose">
        Bienvenido, {admin.email}. Gestiona el contenido del portfolio desde aquí.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Borradores (proyectos)" value={draftProjects} />
        <StatCard label="Borradores (artículos)" value={draftArticles} />
        <StatCard label="Experiencias" value={experiences.length} />
        <StatCard label="Tecnologías" value={technologies.length} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((item) => (
          <Link key={item.label} href={item.href} className="card block no-underline">
            <h2 className="font-medium text-text-primary">{item.label}</h2>
            {item.count != null ? (
              <p className="mt-2 text-2xl font-display font-semibold text-accent">
                {item.count}
              </p>
            ) : (
              <p className="mt-2 text-sm text-text-muted">Configurar</p>
            )}
          </Link>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="recent-activity-heading">
        <h2
          id="recent-activity-heading"
          className="font-display text-xl font-semibold text-text-primary mb-4"
        >
          Actividad reciente
        </h2>

        {recentActivity.length === 0 ? (
          <p className="text-sm text-text-muted">No hay contenido editado todavía.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-surface/80 text-left text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Entidad</th>
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Última edición</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr key={`${item.entityType}-${item.id}`} className="border-t border-border">
                    <td className="px-4 py-3 text-text-secondary">{item.entityLabel}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={item.href}
                        className="font-medium text-text-primary hover:text-accent"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {item.status ? (
                        <span
                          className={
                            item.status === "published" ? "text-accent" : "text-text-muted"
                          }
                        >
                          {item.status === "published" ? "Publicado" : "Borrador"}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {formatRelativeDate(item.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <p className="text-sm text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-display font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return "Hace un momento";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} d`;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}
