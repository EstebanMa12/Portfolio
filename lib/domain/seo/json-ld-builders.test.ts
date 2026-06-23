import { describe, expect, it } from "vitest";
import {
  buildAboutPersonJsonLd,
  buildBlogPostingJsonLd,
  buildHomeJsonLd,
  buildPersonJsonLd,
  buildProfilePageJsonLd,
  buildWebSiteJsonLd,
} from "./json-ld-builders";

const hero = {
  name: "Esteban Maya",
  headline: "Backend Engineer",
  subheadline: "",
  bio: "Building reliable systems.",
  availability: { label: "Available", visible: true },
  photoUrl: "https://example.com/photo.jpg",
  cvUrl: "/cv.pdf",
  socialLinks: {
    github: "https://github.com/estebanmaya",
    linkedin: "https://linkedin.com/in/estebanmaya",
    email: "hello@example.com",
  },
  metrics: [],
};

describe("buildPersonJsonLd", () => {
  it("includes core person fields", () => {
    const data = buildPersonJsonLd({
      name: "Esteban Maya",
      url: "https://example.com/",
      jobTitle: "Backend Engineer",
      sameAs: ["https://github.com/estebanmaya"],
      locale: "es",
    });

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Esteban Maya");
    expect(data.jobTitle).toBe("Backend Engineer");
    expect(data.sameAs).toEqual(["https://github.com/estebanmaya"]);
    expect(data.inLanguage).toBe("es");
  });
});

describe("buildWebSiteJsonLd", () => {
  it("includes site name and url", () => {
    const data = buildWebSiteJsonLd({
      name: "Esteban Maya",
      url: "https://example.com/",
      locale: "en",
    });

    expect(data["@type"]).toBe("WebSite");
    expect(data.name).toBe("Esteban Maya");
    expect(data.url).toBe("https://example.com/");
  });
});

describe("buildHomeJsonLd", () => {
  it("returns a graph with Person and WebSite", () => {
    const data = buildHomeJsonLd({
      hero,
      siteName: "Esteban Maya",
      siteUrl: "https://example.com",
      pageUrl: "https://example.com/",
      locale: "es",
    });

    const graph = data["@graph"] as Array<Record<string, unknown>>;
    expect(graph).toHaveLength(2);
    expect(graph[0]?.["@type"]).toBe("Person");
    expect(graph[1]?.["@type"]).toBe("WebSite");
  });
});

describe("buildAboutPersonJsonLd", () => {
  it("maps about content to person schema", () => {
    const data = buildAboutPersonJsonLd({
      hero,
      about: {
        title: "About",
        paragraphs: ["First paragraph.", "Second paragraph."],
        interests: ["Distributed Systems", "Genomics"],
        bioBridge: [],
      },
      siteName: "Esteban Maya",
      pageUrl: "https://example.com/about",
      locale: "es",
    });

    expect(data.description).toBe("First paragraph. Second paragraph.");
    expect(data.knowsAbout).toEqual(["Distributed Systems", "Genomics"]);
  });
});

describe("buildProfilePageJsonLd", () => {
  it("maps experiences to ProfilePage mainEntity", () => {
    const data = buildProfilePageJsonLd({
      hero,
      experiences: [
        {
          id: "00000000-0000-4000-8000-000000000001",
          company: "Acme",
          role: "Backend Engineer",
          startDate: "2022-01",
          endDate: null,
          bullets: [],
          sortOrder: 0,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ],
      pageUrl: "https://example.com/experience",
      locale: "es",
    });

    expect(data["@type"]).toBe("ProfilePage");
    const mainEntity = data.mainEntity as Record<string, unknown>;
    expect(mainEntity["@type"]).toBe("Person");
    const occupations = mainEntity.hasOccupation as Array<Record<string, unknown>>;
    expect(occupations).toHaveLength(1);
    expect(occupations[0]).toMatchObject({
      name: "Backend Engineer",
      occupationalCategory: "Acme",
    });
  });
});

describe("buildBlogPostingJsonLd", () => {
  it("includes article metadata and author", () => {
    const data = buildBlogPostingJsonLd({
      article: {
        id: "00000000-0000-4000-8000-000000000002",
        title: "Hexagonal Architecture",
        slug: "hexagonal-architecture",
        locale: "es",
        excerpt:
          "A long enough excerpt for the article schema that meets the minimum length requirement for publishing in the portfolio blog system.",
        content: "# Hello",
        tags: ["architecture"],
        coverImageUrl: "https://example.com/cover.png",
        status: "published",
        publishedAt: "2024-06-01T00:00:00.000Z",
        readingTimeMin: 5,
        seoTitle: null,
        seoDescription: null,
        seoOgImage: null,
        seoCanonical: null,
        seoNoindex: false,
        createdAt: "2024-06-01T00:00:00.000Z",
        updatedAt: "2024-06-02T00:00:00.000Z",
      },
      authorName: "Esteban Maya",
      pageUrl: "https://example.com/blog/hexagonal-architecture",
      locale: "es",
    });

    expect(data["@type"]).toBe("BlogPosting");
    expect(data.headline).toBe("Hexagonal Architecture");
    expect(data.image).toBe("https://example.com/cover.png");
    expect(data.timeRequired).toBe("PT5M");
    expect((data.author as Record<string, string>).name).toBe("Esteban Maya");
  });
});
