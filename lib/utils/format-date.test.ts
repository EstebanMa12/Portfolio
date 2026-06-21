import { describe, expect, it } from "vitest";
import { formatExperiencePeriod, formatArticleDate } from "./format-date";

describe("formatExperiencePeriod", () => {
  it("shows Presente when end date is null", () => {
    expect(formatExperiencePeriod("2023-01-01", null).label).toBe(
      "2023 — Presente",
    );
  });

  it("shows year range when end date exists", () => {
    expect(formatExperiencePeriod("2021-01-01", "2023-12-31").label).toBe(
      "2021 — 2023",
    );
  });
});

describe("formatArticleDate", () => {
  it("formats ISO dates in Spanish", () => {
    const result = formatArticleDate("2026-03-01T00:00:00Z");
    expect(result.datetime).toBe("2026-03-01");
    expect(result.label.length).toBeGreaterThan(0);
  });
});
