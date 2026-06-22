"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/technologies", label: "Tecnologías", exact: false },
  { href: "/admin/experience", label: "Experiencia", exact: false },
  { href: "/admin/projects", label: "Proyectos", exact: false },
  { href: "/admin/articles", label: "Artículos", exact: false },
  { href: "/admin/certifications", label: "Certificaciones", exact: false },
  { href: "/admin/pages", label: "Páginas", exact: false },
  { href: "/admin/seo", label: "SEO", exact: false },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="mb-8 flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent/15 text-accent"
                : "text-text-secondary hover:text-text-primary hover:bg-surface",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
