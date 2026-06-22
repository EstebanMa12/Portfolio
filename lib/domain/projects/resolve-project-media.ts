import type { ProjectImage, ProjectWithTechnologies } from "@/lib/schemas/project";

export type ResolvedProjectImage = {
  url: string;
  alt: string;
};

export type ResolvedProjectMedia = {
  images: ResolvedProjectImage[];
  hasGallery: boolean;
  usesCoverFallback: boolean;
};

export function getProjectTitleInitials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function toCarouselImage(image: ProjectImage): ResolvedProjectImage {
  return {
    url: image.imageUrl,
    alt: image.altText,
  };
}

export function resolveProjectMedia(
  project: Pick<
    ProjectWithTechnologies,
    "title" | "images" | "coverImageUrl"
  >,
): ResolvedProjectMedia {
  const gallery = project.images ?? [];

  if (gallery.length > 0) {
    return {
      images: gallery.map(toCarouselImage),
      hasGallery: true,
      usesCoverFallback: false,
    };
  }

  if (project.coverImageUrl) {
    return {
      images: [
        {
          url: project.coverImageUrl,
          alt: project.title,
        },
      ],
      hasGallery: false,
      usesCoverFallback: true,
    };
  }

  return {
    images: [],
    hasGallery: false,
    usesCoverFallback: false,
  };
}
