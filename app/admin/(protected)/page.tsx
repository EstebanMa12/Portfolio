import { SectionLabel } from "@/components/public/section-label";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

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
        Bienvenido, {admin.email}. El CMS estará disponible en los próximos
        epics (Experience, Projects, Blog, Pages, SEO).
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Experiencia", href: "/admin/experience", status: "Próximamente" },
          { label: "Proyectos", href: "/admin/projects", status: "Próximamente" },
          { label: "Artículos", href: "/admin/articles", status: "Próximamente" },
        ].map((item) => (
          <article key={item.label} className="card">
            <h2 className="font-medium text-text-primary">{item.label}</h2>
            <p className="mt-2 text-sm text-text-muted">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
