import { describe, expect, it } from "vitest";
import { heroContentSchema } from "@/lib/schemas/page-content";
import { normalizeHttpUrl } from "@/lib/utils/normalize-url";

describe("normalizeHttpUrl", () => {
  it("adds https when protocol is missing", () => {
    expect(normalizeHttpUrl("www.linkedin.com/in/user")).toBe(
      "https://www.linkedin.com/in/user",
    );
  });

  it("preserves existing https URLs", () => {
    expect(normalizeHttpUrl("https://github.com/user")).toBe(
      "https://github.com/user",
    );
  });
});

describe("heroContentSchema socialLinks", () => {
  it("accepts linkedin URLs without protocol", () => {
    const parsed = heroContentSchema.parse({
      name: "Test",
      headline: "Headline",
      subheadline: "",
      bio: "",
      availability: { label: "Open", visible: true },
      photoUrl: "https://example.com/photo.png",
      cvUrl: "",
      socialLinks: {
        github: "https://github.com/user",
        linkedin: "www.linkedin.com/in/user",
        email: "user@example.com",
      },
      metrics: [],
    });

    expect(parsed.socialLinks.linkedin).toBe("https://www.linkedin.com/in/user");
  });
});
