const monthYear = new Intl.DateTimeFormat("es-ES", {
  month: "short",
  year: "numeric",
});

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
): { label: string; datetime: string } {
  const startYear = yearFromDate(startDate);

  if (!endDate) {
    return {
      label: `${startYear} — Presente`,
      datetime: String(startYear),
    };
  }

  const endYear = yearFromDate(endDate);

  return {
    label: `${startYear} — ${endYear}`,
    datetime: `${startYear}/${endYear}`,
  };
}

export function formatArticleDate(isoDate: string | null): {
  label: string;
  datetime: string;
} {
  if (!isoDate) {
    return { label: "Sin fecha", datetime: "" };
  }

  const date = new Date(isoDate);
  return {
    label: monthYear.format(date),
    datetime: isoDate.slice(0, 10),
  };
}
