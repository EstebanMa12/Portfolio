import { describe, expect, it } from "vitest";
import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";
import {
  formatExperienceDuration,
  getCareerSummary,
  getCompanyInitials,
  getCurrentExperience,
  getExperienceDurationMonths,
  splitBulletMetrics,
} from "./experience-timeline";

function makeExperience(
  overrides: Partial<ExperienceWithTechnologies> = {},
): ExperienceWithTechnologies {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    company: "Acme Corp",
    role: "Software Engineer",
    startDate: "2022-01-01",
    endDate: null,
    bullets: ["Reduced latency by 40%"],
    sortOrder: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    technologies: [
      {
        id: "00000000-0000-4000-8000-000000000010",
        name: "Go",
        slug: "go",
        category: "language",
        iconUrl: null,
        createdAt: "2024-01-01T00:00:00Z",
      },
    ],
    ...overrides,
  };
}

const durationLabels = {
  durationYears: (count: number) => `${count}y`,
  durationMonths: (count: number) => `${count}m`,
  durationMixed: (years: string, months: string) => `${years} · ${months}`,
};

describe("getCompanyInitials", () => {
  it("returns two letters for multi-word companies", () => {
    expect(getCompanyInitials("Acme Corp")).toBe("AC");
  });

  it("returns first two letters for single-word companies", () => {
    expect(getCompanyInitials("Supabase")).toBe("SU");
  });
});

describe("getCurrentExperience", () => {
  it("prefers the role without end date", () => {
    const current = makeExperience({ id: "1", endDate: null });
    const past = makeExperience({
      id: "2",
      endDate: "2021-12-31",
      sortOrder: 2,
    });

    expect(getCurrentExperience([past, current])?.id).toBe("1");
  });

  it("falls back to the first experience", () => {
    const past = makeExperience({ endDate: "2021-12-31" });
    expect(getCurrentExperience([past])?.id).toBe(past.id);
  });

  it("returns null for empty input", () => {
    expect(getCurrentExperience([])).toBeNull();
  });
});

describe("getExperienceDurationMonths", () => {
  it("returns at least one month", () => {
    expect(getExperienceDurationMonths("2024-01-01", "2024-01-15")).toBe(1);
  });
});

describe("formatExperienceDuration", () => {
  it("formats mixed durations", () => {
    expect(formatExperienceDuration(14, durationLabels)).toBe("1y · 2m");
  });

  it("formats whole years", () => {
    expect(formatExperienceDuration(24, durationLabels)).toBe("2y");
  });

  it("formats months only", () => {
    expect(formatExperienceDuration(5, durationLabels)).toBe("5m");
  });
});

describe("getCareerSummary", () => {
  it("aggregates span, roles, and unique technologies", () => {
    const summary = getCareerSummary([
      makeExperience({
        startDate: "2020-01-01",
        endDate: "2022-12-31",
      }),
      makeExperience({
        id: "00000000-0000-4000-8000-000000000002",
        startDate: "2023-01-01",
        endDate: null,
        technologies: [
          {
            id: "00000000-0000-4000-8000-000000000011",
            name: "TypeScript",
            slug: "typescript",
            category: "language",
            iconUrl: null,
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
      }),
    ]);

    expect(summary.roleCount).toBe(2);
    expect(summary.techCount).toBe(2);
    expect(summary.spanYears).toBeGreaterThanOrEqual(1);
  });

  it("returns zeros for empty input", () => {
    expect(getCareerSummary([])).toEqual({
      spanYears: 0,
      roleCount: 0,
      techCount: 0,
    });
  });
});

describe("splitBulletMetrics", () => {
  it("marks numeric fragments as metrics", () => {
    const parts = splitBulletMetrics("Reduced latency by 40% in production");

    expect(parts.some((part) => part.metric && part.text === "40%")).toBe(true);
    expect(parts.some((part) => !part.metric)).toBe(true);
  });

  it("handles bullets without metrics", () => {
    expect(splitBulletMetrics("Led backend migration")).toEqual([
      { text: "Led backend migration", metric: false },
    ]);
  });
});
