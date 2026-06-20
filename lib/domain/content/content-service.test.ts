import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  ensureUniqueSlug,
  generateSlug,
  publishArticle,
  publishProject,
} from "./content-service";
import { computeReadingTime } from "@/lib/utils/reading-time";

vi.mock("@/lib/repositories/project-repo", () => ({
  getById: vi.fn(),
  update: vi.fn(),
  slugExists: vi.fn(),
}));

vi.mock("@/lib/repositories/article-repo", () => ({
  getById: vi.fn(),
  update: vi.fn(),
  slugExists: vi.fn(),
}));

vi.mock("@/lib/repositories/technology-repo", () => ({
  slugExists: vi.fn(),
}));

vi.mock("@/lib/revalidate", () => ({
  revalidateEntity: vi.fn(),
}));

import * as projectRepo from "@/lib/repositories/project-repo";
import * as articleRepo from "@/lib/repositories/article-repo";
import { revalidateEntity } from "@/lib/revalidate";

describe("generateSlug", () => {
  it("slugifies titles with accents and punctuation", () => {
    expect(generateSlug("Arquitectura en Go: APIs")).toBe(
      "arquitectura-en-go-apis",
    );
  });

  it("returns untitled for empty slugs", () => {
    expect(generateSlug("!!!")).toBe("untitled");
  });
});

describe("ensureUniqueSlug", () => {
  beforeEach(() => {
    vi.mocked(projectRepo.slugExists).mockReset();
  });

  it("returns base slug when available", async () => {
    vi.mocked(projectRepo.slugExists).mockResolvedValue(false);

    await expect(
      ensureUniqueSlug("HealthMetrics API", "project"),
    ).resolves.toBe("healthmetrics-api");
  });

  it("appends numeric suffix on collision", async () => {
    vi.mocked(projectRepo.slugExists)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await expect(
      ensureUniqueSlug("HealthMetrics API", "project"),
    ).resolves.toBe("healthmetrics-api-2");
  });
});

describe("computeReadingTime", () => {
  it("estimates reading time from markdown content", () => {
    const content = "word ".repeat(400);
    expect(computeReadingTime(content)).toBe(2);
  });

  it("returns at least one minute", () => {
    expect(computeReadingTime("hola")).toBe(1);
  });
});

describe("publishProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets status to published and revalidates tags", async () => {
    vi.mocked(projectRepo.getById).mockResolvedValue({
      id: "1",
      slug: "demo",
      status: "draft",
    } as never);
    vi.mocked(projectRepo.update).mockResolvedValue({
      id: "1",
      slug: "demo",
      status: "published",
    } as never);

    const result = await publishProject("1");

    expect(projectRepo.update).toHaveBeenCalledWith("1", { status: "published" });
    expect(revalidateEntity).toHaveBeenCalledWith("project", { slug: "demo" });
    expect(result.status).toBe("published");
  });
});

describe("publishArticle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets publishedAt, reading time and revalidates tags", async () => {
    vi.mocked(articleRepo.getById).mockResolvedValue({
      id: "1",
      slug: "post",
      content: "word ".repeat(200),
      publishedAt: null,
      status: "draft",
    } as never);
    vi.mocked(articleRepo.update).mockResolvedValue({
      id: "1",
      slug: "post",
      status: "published",
      readingTimeMin: 1,
    } as never);

    const result = await publishArticle("1");

    expect(articleRepo.update).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        status: "published",
        readingTimeMin: 1,
        publishedAt: expect.any(String),
      }),
    );
    expect(revalidateEntity).toHaveBeenCalledWith("article", { slug: "post" });
    expect(result.status).toBe("published");
  });
});
