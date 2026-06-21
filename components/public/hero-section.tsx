import Image from "next/image";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Button } from "@/components/public/button";
import { ImpactMetrics } from "@/components/public/impact-metrics";
import type { HeroContent } from "@/lib/schemas/page-content";

type HeroSectionProps = {
  hero: HeroContent;
};

export function HeroSection({ hero }: Readonly<HeroSectionProps>) {
  const hasCv = hero.cvUrl.trim().length > 0;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="mb-section-gap-mobile md:mb-section-gap scroll-mt-28"
    >
      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
        <div className="flex-1 space-y-6">
          {hero.availability.visible ? (
            <RevealOnScroll direction="down" delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-muted border border-border text-accent text-xs font-medium">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent availability-pulse"
                  aria-hidden="true"
                />
                {hero.availability.label}
              </div>
            </RevealOnScroll>
          ) : null}

          <RevealOnScroll delay={80}>
            <div>
              <h1
                id="hero-heading"
                className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-text-primary leading-tight"
              >
                {hero.name}
              </h1>
              <p className="mt-3 text-lg md:text-xl text-text-secondary font-medium">
                {hero.headline}
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={160}>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-prose">
              {hero.bio}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={240}>
            <ImpactMetrics metrics={hero.metrics} />
          </RevealOnScroll>

          <RevealOnScroll delay={320}>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/projects">Ver proyectos</Button>
              {hasCv ? (
                <Button href={hero.cvUrl} variant="secondary">
                  <DownloadIcon className="w-4 h-4" />
                  Descargar CV
                </Button>
              ) : (
                <Button href="/contact" variant="secondary">
                  Contactar
                </Button>
              )}
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll
          className="w-full lg:w-80 xl:w-96 shrink-0"
          direction="right"
          delay={120}
        >
          <div className="hero-photo-frame">
            <Image
              src={hero.photoUrl}
              alt={`Foto de perfil de ${hero.name}, Software Engineer`}
              width={384}
              height={480}
              className="hero-photo"
              priority
              unoptimized
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function DownloadIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
