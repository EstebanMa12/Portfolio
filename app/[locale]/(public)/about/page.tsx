import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { AboutPageAmbience } from "@/components/about/about-page-ambience";
import { AboutStoryParagraphs } from "@/components/about/about-story-paragraphs";
import type { MindsetItem } from "@/components/about/engineering-mindset";
import { PageCta } from "@/components/public/page-cta";
import { PageHeader } from "@/components/public/page-header";
import { SectionIntro } from "@/components/public/section-intro";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAboutContent,
  getHeroContent,
  getPublishedProjects,
} from "@/lib/cache/public-queries";
import { getInterestDescriptionKey } from "@/lib/domain/about/interest-slugs";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";
import { buildAboutPersonJsonLd } from "@/lib/domain/seo/json-ld-builders";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import { getSettings } from "@/lib/repositories/seo-repo";
import * as technologyRepo from "@/lib/repositories/technology-repo";

const AboutCredibilityMetrics = dynamic(
  () =>
    import("@/components/about/about-credibility-metrics").then(
      (mod) => mod.AboutCredibilityMetrics,
    ),
);

const AboutEvolutionPath = dynamic(
  () =>
    import("@/components/about/about-evolution-path").then(
      (mod) => mod.AboutEvolutionPath,
    ),
);

const AboutInterests = dynamic(
  () =>
    import("@/components/about/about-interests").then(
      (mod) => mod.AboutInterests,
    ),
);

const BioBridgeInteractive = dynamic(
  () =>
    import("@/components/about/bio-bridge-interactive").then(
      (mod) => mod.BioBridgeInteractive,
    ),
);

const EngineeringMindset = dynamic(
  () =>
    import("@/components/about/engineering-mindset").then(
      (mod) => mod.EngineeringMindset,
    ),
);

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const about = await getAboutContent(locale);
  return createPageMetadata(locale, "/about", {
    title: about?.title,
    description: about?.paragraphs[0],
  });
}

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  const tCta = await getTranslations({ locale, namespace: "cta" });

  const [about, hero, settings, projects, technologies] = await Promise.all([
    getAboutContent(locale),
    getHeroContent(locale),
    getSettings(locale),
    getPublishedProjects(locale),
    technologyRepo.getAll(),
  ]);

  if (!about) {
    notFound();
  }

  const interestDescriptions = t.raw("interestDescriptions") as Record<
    string,
    string
  >;
  const bioBridgeTooltips = t.raw("bioBridgeTooltips") as string[];
  const mindsetItems = t.raw("mindsetItems") as MindsetItem[];
  const metricsValues = t.raw("metricsValues") as {
    yearsCoding: number;
    yearsSuffix: string;
  };

  const interests = about.interests.map((name) => {
    const slug = getInterestDescriptionKey(name, locale);
    return {
      name,
      description: interestDescriptions[slug] ?? name,
      relatedHref: "/projects",
      relatedLabel: t("interestsRelated"),
    };
  });

  const bioBridgeRows = about.bioBridge.map((row, index) => ({
    ...row,
    tooltip: bioBridgeTooltips[index],
  }));

  const specializationCount =
    about.skills && about.skills.length > 0 ? about.skills.length : 4;

  const credibilityMetrics = [
    {
      label: t("metrics.yearsCoding"),
      value: metricsValues.yearsCoding,
      suffix: metricsValues.yearsSuffix,
    },
    {
      label: t("metrics.projects"),
      value: projects.length,
    },
    {
      label: t("metrics.technologies"),
      value: technologies.length,
    },
    {
      label: t("metrics.specializations"),
      value: specializationCount,
    },
  ];

  return (
    <>
      <JsonLd
        data={buildAboutPersonJsonLd({
          hero,
          about,
          siteName: settings.siteName,
          pageUrl: `${settings.siteUrl}${localizedPath("/about", locale)}`,
          locale,
        })}
      />

      <div className="about-page relative">
        <AboutPageAmbience />

        <section aria-labelledby="about-heading" className="relative py-8">
          <PageHeader
            label={t("title")}
            title={about.title}
            headingId="about-heading"
            className="mb-6"
          />

          <AboutEvolutionPath
            label={t("evolutionLabel")}
            fromLabel={t("evolutionFrom")}
            toLabel={t("evolutionTo")}
            fromDetail={t("evolutionFromDetail")}
            toDetail={t("evolutionToDetail")}
          />

          <div className="mt-10 mb-section-gap-mobile md:mb-section-gap">
            <AboutCredibilityMetrics
              metrics={credibilityMetrics}
              ariaLabel={t("metricsAria")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-section-gap-mobile md:mb-section-gap">
            <div className="lg:col-span-7">
              <AboutStoryParagraphs paragraphs={about.paragraphs} />
            </div>

            {about.interests.length > 0 ? (
              <div className="lg:col-span-5 lg:pt-1">
                <AboutInterests title={t("interests")} interests={interests} />
              </div>
            ) : null}
          </div>

          <section
            aria-labelledby="bio-bridge-heading"
            className="mb-section-gap-mobile md:mb-section-gap"
          >
            <SectionIntro
              label={t("bioBridgeLabel")}
              title={t("bioBridgeTitle")}
              description={t("bioBridgeDescription")}
              headingId="bio-bridge-heading"
            />

            <BioBridgeInteractive
              rows={bioBridgeRows}
              fromLabel={t("bioBridgeFrom")}
              toLabel={t("bioBridgeTo")}
            />
          </section>

          <EngineeringMindset
            label={t("mindsetLabel")}
            title={t("mindsetTitle")}
            description={t("mindsetDescription")}
            items={mindsetItems}
            bioLabel={t("mindsetBioLabel")}
            softwareLabel={t("mindsetSoftwareLabel")}
          />

          <PageCta
            title={tCta("nextStep")}
            description={tCta("aboutDescription")}
            primaryHref="/experience"
            primaryLabel={tCta("viewExperience")}
            secondaryHref="/contact"
            secondaryLabel={tCta("contact")}
          />
        </section>
      </div>
    </>
  );
}
