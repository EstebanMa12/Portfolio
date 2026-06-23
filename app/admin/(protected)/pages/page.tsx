import Link from "next/link";
import { SectionLabel } from "@/components/public/section-label";

const pages = [
  { slug: "hero", label: "Hero", description: "Home: nombre, métricas, foto, CV y redes." },
  { slug: "about", label: "About", description: "Párrafos, intereses y bio-bridge." },
  { slug: "contact", label: "Contact", description: "Título, descripción y enlaces de contacto." },
] as const;

export default function AdminPagesIndexPage() {
  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-2">Páginas</h1>
      <p className="text-sm text-text-secondary mb-8">
        Edita el contenido JSONB de las secciones estáticas del sitio.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link key={page.slug} href={`/admin/pages/${page.slug}`} className="card block no-underline">
            <h2 className="font-medium text-text-primary">{page.label}</h2>
            <p className="mt-2 text-sm text-text-muted">{page.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
