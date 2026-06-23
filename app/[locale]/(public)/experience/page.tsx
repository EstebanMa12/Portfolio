import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ExperienceTimeline } from "@/components/public/experience-timeline";
import { PageCta } from "@/components/public/page-cta";
import { PageHeader } from "@/components/public/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllExperiences,
  getHeroContent,
} from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";
import { buildProfilePageJsonLd } from "@/lib/domain/seo/json-ld-builders";
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
          data={buildProfilePageJsonLd({
            hero,
            experiences,
            pageUrl: experienceUrl,
            locale,
          })}
        />
      ) : null}

      <section aria-labelledby="experience-heading" className="py-8">
        <PageHeader
          label={t("title")}
          title={t("title")}
          description={t("description")}
          headingId="experience-heading"
        />

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
