/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCardMedia } from "@/components/public/project-card-media";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string, values?: Record<string, string>) => {
    if (key === "noPreview" && values?.title) {
      return `No preview for ${values.title}`;
    }
    return key;
  },
}));

vi.mock("@/components/public/project-image-carousel", () => ({
  ProjectImageCarousel: ({
    images,
    title,
  }: {
    images: { url: string; alt: string }[];
    title: string;
  }) => (
    <div data-testid="carousel">
      {images.map((image) => (
        <img key={image.url} src={image.url} alt={image.alt || title} />
      ))}
    </div>
  ),
}));

describe("ProjectCardMedia", () => {
  it("renders carousel when images exist", async () => {
    const ui = await ProjectCardMedia({
      project: {
        title: "Demo",
        category: "Backend",
        coverImageUrl: null,
        images: [
          {
            id: "11111111-1111-1111-1111-111111111111",
            imageUrl: "https://example.com/one.jpg",
            altText: "One",
            sortOrder: 0,
          },
        ],
      },
    });

    render(ui);
    expect(screen.getByTestId("carousel")).toBeTruthy();
  });

  it("renders placeholder when no gallery or cover exists", async () => {
    const ui = await ProjectCardMedia({
      project: {
        title: "Batch ETL Pipeline",
        category: "Data · Pipeline",
        coverImageUrl: null,
        images: [],
      },
    });

    render(ui);
    expect(screen.getByRole("img", { name: "No preview for Batch ETL Pipeline" })).toBeTruthy();
    expect(screen.getByText("BE")).toBeTruthy();
    expect(screen.getByText("Data · Pipeline")).toBeTruthy();
  });
});
