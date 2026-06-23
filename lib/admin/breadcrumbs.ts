export type AdminBreadcrumbItem = {
  label: string;
  href?: string;
};

const SECTIONS: Record<string, { label: string; href: string }> = {
  technologies: { label: "Tecnologías", href: "/admin/technologies" },
  experience: { label: "Experiencia", href: "/admin/experience" },
  projects: { label: "Proyectos", href: "/admin/projects" },
  articles: { label: "Artículos", href: "/admin/articles" },
  certifications: { label: "Certificaciones", href: "/admin/certifications" },
  pages: { label: "Páginas", href: "/admin/pages" },
  seo: { label: "SEO", href: "/admin/seo" },
};

const PAGE_SLUG_LABELS: Record<string, string> = {
  hero: "Hero",
  about: "About",
  contact: "Contact",
};

const NEW_LABELS: Record<string, string> = {
  projects: "Nuevo proyecto",
  articles: "Nuevo artículo",
  experience: "Nueva experiencia",
};

const EDIT_LABELS: Record<string, string> = {
  projects: "Editar proyecto",
  articles: "Editar artículo",
  experience: "Editar experiencia",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getAdminBreadcrumbs(pathname: string): AdminBreadcrumbItem[] {
  if (pathname === "/admin") {
    return [{ label: "Dashboard" }];
  }

  if (!pathname.startsWith("/admin/")) {
    return [{ label: "Admin", href: "/admin" }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const sectionKey = segments[1];
  const section = sectionKey ? SECTIONS[sectionKey] : undefined;

  if (!section) {
    return [
      { label: "Admin", href: "/admin" },
      { label: "Página" },
    ];
  }

  const items: AdminBreadcrumbItem[] = [
    { label: "Admin", href: "/admin" },
    { label: section.label, href: section.href },
  ];

  const trailing = segments[2];
  if (!trailing) {
    items[items.length - 1] = { label: section.label };
    return items;
  }

  if (trailing === "new") {
    items.push({ label: NEW_LABELS[sectionKey ?? ""] ?? "Nuevo" });
    return items;
  }

  if (sectionKey === "pages") {
    items.push({ label: PAGE_SLUG_LABELS[trailing] ?? formatSlugLabel(trailing) });
    return items;
  }

  if (UUID_PATTERN.test(trailing)) {
    items.push({ label: EDIT_LABELS[sectionKey ?? ""] ?? "Editar" });
    return items;
  }

  items.push({ label: formatSlugLabel(trailing) });
  return items;
}

function formatSlugLabel(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
