import { describe, expect, it } from "vitest";
import { formatExperiencePeriod, formatArticleDate } from "./format-date";

describe("formatExperiencePeriod", () => {
  it("uses present label when end date is null", () => {
    expect(formatExperiencePeriod("2023-01-01", null, "Presente").label).toBe(
      "2023 — Presente",
    );
    expect(formatExperiencePeriod("2023-01-01", null, "Present").label).toBe(
      "2023 — Present",
    );
  });

  it("shows year range when end date exists", () => {
    expect(formatExperiencePeriod("2021-01-01", "2023-12-31", "Present").label).toBe(
      "2021 — 2023",
    );
  });
});

describe("formatArticleDate", () => {
  it("formats ISO dates by locale", () => {
    const es = formatArticleDate("2026-03-01T00:00:00Z", "es", "Sin fecha");
    const en = formatArticleDate("2026-03-01T00:00:00Z", "en", "No date");

    expect(es.datetime).toBe("2026-03-01");
    expect(en.datetime).toBe("2026-03-01");
    expect(es.label.length).toBeGreaterThan(0);
    expect(en.label.length).toBeGreaterThan(0);
  });

  it("returns no-date label when date is missing", () => {
    expect(formatArticleDate(null, "en", "No date").label).toBe("No date");
  });
});
