import type { Metadata } from "next";
import { PageCta } from "@/components/public/page-cta";
import { ProjectGrid } from "@/components/public/project-card";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { getPublishedProjects } from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata("/projects");
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <section aria-labelledby="projects-heading" className="py-8">
      <RevealOnScroll>
        <SectionLabel className="mb-3">Proyectos</SectionLabel>
        <h1
          id="projects-heading"
          className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-10"
        >
          Trabajo seleccionado
        </h1>
      </RevealOnScroll>

      <ProjectGrid projects={projects} />

      <PageCta
        title="¿Te interesa colaborar?"
        description="Abierto a conversaciones sobre backend, platform engineering y arquitectura."
        primaryHref="/contact"
        primaryLabel="Contactar"
        secondaryHref="/experience"
        secondaryLabel="Ver experiencia"
      />
    </section>
  );
}
