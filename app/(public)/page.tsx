import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedProjects } from "@/components/public/project-card";
import { HeroSection } from "@/components/public/hero-section";
import { LatestArticles } from "@/components/public/article-card";
import { ContactCard } from "@/components/public/contact-card";
import { SkillsDashboard } from "@/components/public/skills-dashboard";
import { AchievementsCarousel } from "@/components/public/achievements-carousel";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAboutContent,
  getAchievementsContent,
  getContactContent,
  getFeaturedProjects,
  getHeroContent,
  getLatestArticles,
} from "@/lib/cache/public-queries";
import { resolvePageMeta, toMetadata } from "@/lib/domain/seo/seo-service";
import { getSettings } from "@/lib/repositories/seo-repo";
import * as technologyRepo from "@/lib/repositories/technology-repo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [hero, settings] = await Promise.all([getHeroContent(), getSettings()]);

  return toMetadata(
    resolvePageMeta(
      settings,
      {
        title: hero?.name ?? settings.siteName,
        description: hero?.bio ?? settings.defaultDescription,
      },
      "/",
    ),
  );
}

export default async function HomePage() {
  const [hero, featuredProjects, latestArticles, about, achievements, contact, technologies, settings] =
    await Promise.all([
      getHeroContent(),
      getFeaturedProjects(),
      getLatestArticles(),
      getAboutContent(),
      getAchievementsContent(),
      getContactContent(),
      technologyRepo.getAll(),
      getSettings(),
    ]);

  if (!hero || !about || !contact) {
    notFound();
  }

  const siteUrl = settings.siteUrl;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              name: hero.name,
              url: siteUrl,
              jobTitle: hero.headline,
              sameAs: [hero.socialLinks.github, hero.socialLinks.linkedin],
            },
            {
              "@type": "WebSite",
              name: settings.siteName,
              url: siteUrl,
            },
          ],
        }}
      />
      <HeroSection hero={hero} />
      <FeaturedProjects projects={featuredProjects} />
      <LatestArticles articles={latestArticles} />
      <SkillsDashboard
        metrics={hero.metrics}
        about={about}
        technologies={technologies}
      />
      {achievements ? <AchievementsCarousel content={achievements} /> : null}
      <RevealOnScroll>
        <section
          id="contact"
          aria-labelledby="home-contact-heading"
          className="scroll-mt-28"
        >
          <h2 id="home-contact-heading" className="sr-only">
            Contacto
          </h2>
          <ContactCard contact={contact} />
        </section>
      </RevealOnScroll>
    </>
  );
}
