import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";

function parseDate(dateStr: string): Date {
  return new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
}

export function getCompanyInitials(company: string): string {
  const words = company.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";

  const first = words[0]!;
  if (words.length === 1) return first.slice(0, 2).toUpperCase();

  const second = words[1]!;
  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase();
}

export function getExperienceDurationMonths(
  startDate: string,
  endDate: string | null,
): number {
  const start = parseDate(startDate);
  const end = endDate ? parseDate(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  return Math.max(1, months);
}

export function getExperienceStartYear(startDate: string): number {
  return parseDate(startDate).getFullYear();
}

type ExperienceDurationLabels = {
  durationYears: (count: number) => string;
  durationMonths: (count: number) => string;
  durationMixed: (years: string, months: string) => string;
};

export function formatExperienceDuration(
  months: number,
  labels: ExperienceDurationLabels,
): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return labels.durationMixed(
      labels.durationYears(years),
      labels.durationMonths(remainingMonths),
    );
  }

  if (years > 0) {
    return labels.durationYears(years);
  }

  return labels.durationMonths(remainingMonths || months);
}

export function getCurrentExperience(
  experiences: ExperienceWithTechnologies[],
): ExperienceWithTechnologies | null {
  if (experiences.length === 0) return null;
  return experiences.find((experience) => !experience.endDate) ?? experiences[0]!;
}

export function getCareerSummary(experiences: ExperienceWithTechnologies[]) {
  if (experiences.length === 0) {
    return { spanYears: 0, roleCount: 0, techCount: 0 };
  }

  const earliestStart = new Date(
    Math.min(...experiences.map((experience) => parseDate(experience.startDate).getTime())),
  );

  const now = new Date();
  const spanYears = Math.max(
    1,
    now.getFullYear() -
      earliestStart.getFullYear() -
      (now.getMonth() < earliestStart.getMonth() ? 1 : 0),
  );

  const techCount = new Set(
    experiences.flatMap((experience) =>
      experience.technologies.map((tech) => tech.id),
    ),
  ).size;

  return {
    spanYears,
    roleCount: experiences.length,
    techCount,
  };
}

const METRIC_SPLIT = /(\d[\d,.]*(?:%|\+|ms|s|min|h|M\+|K\+)?|\d+\+)/g;
const METRIC_TEST = /^\d[\d,.]*(?:%|\+|ms|s|min|h|M\+|K\+)?$|^\d+\+$/;

export function splitBulletMetrics(
  text: string,
): Array<{ text: string; metric: boolean }> {
  return text
    .split(METRIC_SPLIT)
    .filter(Boolean)
    .map((part) => ({
      text: part,
      metric: METRIC_TEST.test(part),
    }));
}
