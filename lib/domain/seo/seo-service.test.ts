import { describe, expect, it } from "vitest";
import { resolvePageMeta, formatTitle } from "./seo-service";
import type { SeoSettings } from "./types";

const settings: SeoSettings = {
  siteName: "Esteban Maya",
  titleTemplate: "%s | Esteban Maya",
  defaultDescription: "Default site description.",
  siteUrl: "https://example.com",
  defaultOgImage: "https://example.com/og.png",
  twitterHandle: "@estebanmaya",
};

describe("formatTitle", () => {
  it("replaces %s with page title", () => {
    expect(formatTitle("%s | Esteban Maya", "Proyectos", "Esteban Maya")).toBe(
      "Proyectos | Esteban Maya",
    );
  });
});

describe("resolvePageMeta", () => {
  it("uses page title and description when provided", () => {
    const resolved = resolvePageMeta(
      settings,
      { title: "Blog", description: "Notas técnicas." },
      "/blog",
    );

    expect(resolved.title).toBe("Blog | Esteban Maya");
    expect(resolved.description).toBe("Notas técnicas.");
    expect(resolved.canonical).toBe("https://example.com/blog");
    expect(resolved.robots).toBe("index, follow");
  });

  it("falls back to global defaults when page fields are empty", () => {
    const resolved = resolvePageMeta(settings, {}, "/");

    expect(resolved.title).toBe("Esteban Maya");
    expect(resolved.description).toBe(settings.defaultDescription);
    expect(resolved.canonical).toBe("https://example.com/");
  });

  it("respects custom canonical and noindex", () => {
    const resolved = resolvePageMeta(
      settings,
      {
        title: "Draft",
        canonical: "https://example.com/custom",
        noindex: true,
      },
      "/draft",
    );

    expect(resolved.canonical).toBe("https://example.com/custom");
    expect(resolved.robots).toBe("noindex, nofollow");
  });

  it("uses page og image over global default", () => {
    const resolved = resolvePageMeta(
      settings,
      { title: "Artículo", ogImage: "https://example.com/article.png" },
      "/blog/test",
      "article",
    );

    expect(resolved.openGraph.images).toEqual([
      { url: "https://example.com/article.png" },
    ]);
    expect(resolved.openGraph.type).toBe("article");
    expect(resolved.twitter.creator).toBe("@estebanmaya");
  });
});
