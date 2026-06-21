/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectImageCarousel } from "@/components/public/project-image-carousel";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
  }) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, number>) => {
    if (key === "carouselSlideOf" && values) {
      return `Slide ${values.current} of ${values.total}`;
    }
    return key;
  },
}));

describe("ProjectImageCarousel", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it("returns null with zero images", () => {
    const { container } = render(
      <ProjectImageCarousel images={[]} title="Demo" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders a static image for a single item", () => {
    render(
      <ProjectImageCarousel
        images={[{ url: "https://example.com/one.jpg", alt: "One" }]}
        title="Demo"
      />,
    );

    expect(screen.getByRole("img", { name: "One" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "carouselPrev" })).toBeNull();
  });

  it("renders carousel controls for multiple images", () => {
    render(
      <ProjectImageCarousel
        images={[
          { url: "https://example.com/one.jpg", alt: "One" },
          { url: "https://example.com/two.jpg", alt: "Two" },
        ]}
        title="Demo"
      />,
    );

    expect(screen.getByRole("button", { name: "carouselPrev" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "carouselNext" })).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });
});
