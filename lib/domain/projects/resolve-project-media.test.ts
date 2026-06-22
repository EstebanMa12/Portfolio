import { describe, expect, it } from "vitest";
import {
  getProjectTitleInitials,
  resolveProjectMedia,
} from "@/lib/domain/projects/resolve-project-media";

describe("getProjectTitleInitials", () => {
  it("returns up to two initials from the title", () => {
    expect(getProjectTitleInitials("HealthMetrics API")).toBe("HA");
    expect(getProjectTitleInitials("ETL")).toBe("E");
  });
});

describe("resolveProjectMedia", () => {
  it("prefers gallery images when present", () => {
    const result = resolveProjectMedia({
      title: "Demo",
      coverImageUrl: "https://example.com/cover.jpg",
      images: [
        {
          id: "11111111-1111-1111-1111-111111111111",
          imageUrl: "https://example.com/gallery.jpg",
          altText: "Gallery",
          sortOrder: 0,
        },
      ],
    });

    expect(result).toEqual({
      images: [{ url: "https://example.com/gallery.jpg", alt: "Gallery" }],
      hasGallery: true,
      usesCoverFallback: false,
    });
  });

  it("falls back to cover image when gallery is empty", () => {
    const result = resolveProjectMedia({
      title: "Demo",
      coverImageUrl: "https://example.com/cover.jpg",
      images: [],
    });

    expect(result).toEqual({
      images: [{ url: "https://example.com/cover.jpg", alt: "Demo" }],
      hasGallery: false,
      usesCoverFallback: true,
    });
  });

  it("returns empty media when no gallery or cover exists", () => {
    const result = resolveProjectMedia({
      title: "Demo",
      coverImageUrl: null,
      images: [],
    });

    expect(result).toEqual({
      images: [],
      hasGallery: false,
      usesCoverFallback: false,
    });
  });
});
