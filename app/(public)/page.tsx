import type { Metadata } from "next";
import { MetricGrid, MetricHighlight } from "@/components/public/metric-highlight";
import { SectionLabel } from "@/components/public/section-label";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata("/");
}

export default function HomePage() {
  return (
    <section aria-labelledby="home-heading" className="py-8">
      <SectionLabel className="mb-3">Portafolio</SectionLabel>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-muted border border-border text-accent text-xs font-medium mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        Epic 2 — Design Shell
      </div>

      <h1
        id="home-heading"
        className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-text-primary leading-tight"
      >
        Esteban Maya
      </h1>
      <p className="mt-3 text-lg md:text-xl text-text-secondary font-medium">
        Software Engineer · Backend &amp; Sistemas Distribuidos
      </p>
      <p className="mt-4 max-w-prose text-text-secondary text-base md:text-lg leading-relaxed">
        Shell público con design tokens, navegación y metadata SEO conectados a
        Supabase.
      </p>

      <div className="mt-8">
        <MetricGrid>
          <MetricHighlight
            label="Design system"
            value="IDEA.html"
            detail="Tokens, componentes base y layouts"
          />
          <MetricHighlight
            label="Rutas"
            value="6 páginas"
            detail="Skeleton listo para contenido real"
          />
        </MetricGrid>
      </div>
    </section>
  );
}
