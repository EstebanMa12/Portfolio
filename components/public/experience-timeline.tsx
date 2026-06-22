import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ExperienceTimelineInteractive } from "@/components/public/experience-timeline-interactive";
import type { ExperienceTimelineItem } from "@/lib/domain/experience/experience-timeline-types";
import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";
import {
  getCareerSummary,
  getExperienceDurationMonths,
  getExperienceStartYear,
  formatExperienceDuration,
} from "@/lib/utils/experience-timeline";
import { formatExperiencePeriod } from "@/lib/utils/format-date";
import { getLocale, getTranslations } from "next-intl/server";

const MAX_VISIBLE_TECHNOLOGIES = 8;

type ExperienceTimelineProps = {
  experiences: ExperienceWithTechnologies[];
};

export async function ExperienceTimeline({
  experiences,
}: Readonly<ExperienceTimelineProps>) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "experience" });

  if (experiences.length === 0) {
    return (
      <p className="text-text-secondary text-sm">{t("empty")}</p>
    );
  }

  const summary = getCareerSummary(experiences);

  const durationLabels = {
    durationYears: (count: number) => t("durationYears", { count }),
    durationMonths: (count: number) => t("durationMonths", { count }),
    durationMixed: (years: string, months: string) =>
      t("durationMixed", { years, months }),
  };

  const items: ExperienceTimelineItem[] = experiences.map((experience) => {
    const isCurrent = !experience.endDate;
    const period = formatExperiencePeriod(
      experience.startDate,
      experience.endDate,
      t("present"),
    );
    const hiddenTechnologyCount = Math.max(
      0,
      experience.technologies.length - MAX_VISIBLE_TECHNOLOGIES,
    );

    return {
      id: experience.id,
      company: experience.company,
      role: experience.role,
      startYear: getExperienceStartYear(experience.startDate),
      periodLabel: period.label,
      periodDatetime: period.datetime,
      durationLabel: formatExperienceDuration(
        getExperienceDurationMonths(
          experience.startDate,
          experience.endDate,
        ),
        durationLabels,
      ),
      bullets: experience.bullets,
      technologies: experience.technologies,
      isCurrent,
      moreTechnologiesLabel: t("moreTechnologies", {
        count: hiddenTechnologyCount,
      }),
    };
  });

  const labels = {
    present: t("present"),
    currentRole: t("currentRole"),
    stack: t("stack"),
    summaryLabel: t("summaryLabel"),
    yearsInIndustry: t("yearsInIndustry"),
    roles: t("roles"),
    technologiesUsed: t("technologiesUsed"),
    timelineLabel: t("timelineLabel"),
    roleNavLabel: t("roleNavLabel"),
    expandRole: t("expandRole"),
    collapseRole: t("collapseRole"),
    showLessTech: t("showLessTech"),
  };

  return (
    <RevealOnScroll>
      <ExperienceTimelineInteractive
        items={items}
        summary={summary}
        labels={labels}
      />
    </RevealOnScroll>
  );
}
