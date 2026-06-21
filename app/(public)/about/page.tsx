import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/public/badge";
import { BioBridgeTable } from "@/components/public/bio-bridge-table";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAboutContent,
  getHeroContent,
} from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";
import { getSettings } from "@/lib/repositories/seo-repo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent();
  return createPageMetadata("/about", {
    title: about?.title ?? "Sobre mí",
    description: about?.paragraphs[0],
  });
}

export default async function AboutPage() {
  const [about, hero, settings] = await Promise.all([
    getAboutContent(),
    getHeroContent(),
    getSettings(),
  ]);

  if (!about) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: hero?.name ?? settings.siteName,
          description: about.paragraphs.join(" "),
          knowsAbout: about.interests,
          url: `${settings.siteUrl}/about`,
        }}
      />

      <section aria-labelledby="about-heading" className="py-8">
        <RevealOnScroll>
          <SectionLabel className="mb-3">Sobre mí</SectionLabel>
          <h1
            id="about-heading"
            className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-10"
          >
            {about.title}
          </h1>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mb-section-gap-mobile md:mb-section-gap">
          <RevealOnScroll className="lg:col-span-2" delay={80}>
            <div className="space-y-5 text-text-secondary text-base leading-relaxed max-w-prose">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </RevealOnScroll>

          {about.interests.length > 0 ? (
            <RevealOnScroll delay={160}>
              <div>
                <h2 className="text-sm font-semibold text-text-primary mb-4">
                  Intereses
                </h2>
                <ul className="flex flex-wrap gap-2" role="list">
                  {about.interests.map((interest) => (
                    <li key={interest}>
                      <Badge>{interest}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          ) : null}
        </div>

        <section aria-labelledby="bio-bridge-heading">
          <RevealOnScroll>
            <SectionLabel className="mb-3">Transferencia de skills</SectionLabel>
            <h2
              id="bio-bridge-heading"
              className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-4"
            >
              Bioingeniería ↔ Software
            </h2>
            <p className="text-text-secondary text-base leading-relaxed max-w-prose mb-10">
              Mi formación científica se traduce directamente en cómo diseño,
              valido y opero sistemas de software en producción.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <BioBridgeTable rows={about.bioBridge} />
          </RevealOnScroll>
        </section>
      </section>
    </>
  );
}
