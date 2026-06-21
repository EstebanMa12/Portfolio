import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ExperienceTimeline } from "@/components/public/experience-timeline";
import { PageCta } from "@/components/public/page-cta";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllExperiences,
  getHeroContent,
} from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import { getSettings } from "@/lib/repositories/seo-repo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return createPageMetadata(locale, "/experience");
}

export default async function ExperiencePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "experience" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const [experiences, hero, settings] = await Promise.all([
    getAllExperiences(locale),
    getHeroContent(locale),
    getSettings(locale),
  ]);

  const experiencePath = localizedPath("/experience", locale);
  const experienceUrl = `${settings.siteUrl}${experiencePath}`;

  return (
    <>
      {hero && experiences.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                name: hero.name,
                url: experienceUrl,
                jobTitle: hero.headline,
                inLanguage: locale,
              },
              ...experiences.map((experience) => ({
                "@type": "OrganizationRole",
                roleName: experience.role,
                memberOf: {
                  "@type": "Organization",
                  name: experience.company,
                },
                startDate: experience.startDate,
                ...(experience.endDate ? { endDate: experience.endDate } : {}),
              })),
            ],
          }}
        />
      ) : null}

      <section aria-labelledby="experience-heading" className="py-8">
        <RevealOnScroll>
          <SectionLabel className="mb-3">{t("title")}</SectionLabel>
          <h1
            id="experience-heading"
            className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary"
          >
            {t("title")}
          </h1>
          <p className="mt-3 text-text-secondary max-w-prose leading-relaxed mb-10">
            {t("description")}
          </p>
        </RevealOnScroll>

        <ExperienceTimeline experiences={experiences} />

        <PageCta
          title={tCta("nextStep")}
          description={tCta("defaultDescription")}
          primaryHref="/projects"
          primaryLabel={tCta("viewProjects")}
          secondaryHref="/contact"
          secondaryLabel={tCta("contact")}
        />
      </section>
    </>
  );
}
