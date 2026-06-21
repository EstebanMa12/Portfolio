import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
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
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import { getSettings } from "@/lib/repositories/seo-repo";
import * as technologyRepo from "@/lib/repositories/technology-repo";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const [hero, settings] = await Promise.all([
    getHeroContent(locale),
    getSettings(locale),
  ]);

  return createPageMetadata(locale, "/", {
    title: hero?.name ?? settings.siteName,
    description: hero?.bio ?? settings.defaultDescription,
  });
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "a11y" });

  const [hero, featuredProjects, latestArticles, about, achievements, contact, technologies, settings] =
    await Promise.all([
      getHeroContent(locale),
      getFeaturedProjects(locale),
      getLatestArticles(locale),
      getAboutContent(locale),
      getAchievementsContent(locale),
      getContactContent(locale),
      technologyRepo.getAll(),
      getSettings(locale),
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
              url: `${siteUrl}${localizedPath("/", locale)}`,
              jobTitle: hero.headline,
              sameAs: [hero.socialLinks.github, hero.socialLinks.linkedin],
              inLanguage: locale,
            },
            {
              "@type": "WebSite",
              name: settings.siteName,
              url: `${siteUrl}${localizedPath("/", locale)}`,
              inLanguage: locale,
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
            {t("homeContact")}
          </h2>
          <ContactCard contact={contact} />
        </section>
      </RevealOnScroll>
    </>
  );
}
