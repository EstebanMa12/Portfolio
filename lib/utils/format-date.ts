import type { Locale } from "@/lib/i18n/config";

const LOCALE_TAGS: Record<Locale, string> = {
  es: "es-ES",
  en: "en-US",
};

function yearFromDate(dateStr: string): number {
  const year = dateStr.slice(0, 4);
  if (/^\d{4}$/.test(year)) {
    return Number(year);
  }

  return new Date(dateStr).getFullYear();
}

export function formatExperiencePeriod(
  startDate: string,
  endDate: string | null,
  presentLabel: string,
): { label: string; datetime: string } {
  const startYear = yearFromDate(startDate);

  if (!endDate) {
    return {
      label: `${startYear} — ${presentLabel}`,
      datetime: String(startYear),
    };
  }

  const endYear = yearFromDate(endDate);

  return {
    label: `${startYear} — ${endYear}`,
    datetime: `${startYear}/${endYear}`,
  };
}

export function formatArticleDate(
  isoDate: string | null,
  locale: Locale,
  noDateLabel: string,
): { label: string; datetime: string } {
  if (!isoDate) {
    return { label: noDateLabel, datetime: "" };
  }

  const formatter = new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    month: "short",
    year: "numeric",
  });
  const date = new Date(isoDate);

  return {
    label: formatter.format(date),
    datetime: isoDate.slice(0, 10),
  };
}
