import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/public/experience-timeline";
import { PageCta } from "@/components/public/page-cta";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { getAllExperiences } from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata("/experience");
}

export default async function ExperiencePage() {
  const experiences = await getAllExperiences();

  return (
    <section aria-labelledby="experience-heading" className="py-8">
      <RevealOnScroll>
        <SectionLabel className="mb-3">Experiencia</SectionLabel>
        <h1
          id="experience-heading"
          className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-10"
        >
          Trayectoria profesional
        </h1>
      </RevealOnScroll>

      <ExperienceTimeline experiences={experiences} />

      <PageCta
        title="¿Quieres ver el impacto en proyectos?"
        description="Explora case studies con problema, solución y resultados medibles."
        primaryHref="/projects"
        primaryLabel="Ver proyectos"
        secondaryHref="/contact"
        secondaryLabel="Contactar"
      />
    </section>
  );
}
