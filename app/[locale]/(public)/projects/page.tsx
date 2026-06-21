import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PageCta } from "@/components/public/page-cta";
import { ProjectGrid } from "@/components/public/project-card";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { getPublishedProjects } from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return createPageMetadata(locale, "/projects");
}

export default async function ProjectsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "projects" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const projects = await getPublishedProjects(locale);

  return (
    <section aria-labelledby="projects-heading" className="py-8">
      <RevealOnScroll>
        <SectionLabel className="mb-3">{t("title")}</SectionLabel>
        <h1
          id="projects-heading"
          className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-10"
        >
          {t("title")}
        </h1>
      </RevealOnScroll>

      <ProjectGrid projects={projects} />

      <PageCta
        description={tCta("defaultDescription")}
        primaryHref="/contact"
        primaryLabel={tCta("contact")}
        secondaryHref="/experience"
        secondaryLabel={tNav("experience")}
      />
    </section>
  );
}
