import type { Database } from "@/types/database";
import type { Article } from "@/lib/schemas/article";
import type { Experience, ExperienceWithTechnologies } from "@/lib/schemas/experience";
import type {
  Project,
  ProjectImage,
  ProjectWithTechnologies,
} from "@/lib/schemas/project";
import { projectWithTechnologiesSchema } from "@/lib/schemas/project";
import type { Locale } from "@/lib/i18n/config";
import type { Technology } from "@/lib/schemas/technology";
import type { MediaAsset } from "@/lib/schemas/media";

type TechnologyRow = Database["public"]["Tables"]["technologies"]["Row"];
type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectImageRow = Database["public"]["Tables"]["project_images"]["Row"];
type ProjectImageJoinRow = Pick<
  ProjectImageRow,
  "id" | "image_url" | "alt_text" | "sort_order"
>;
type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type MediaAssetRow = Database["public"]["Tables"]["media_assets"]["Row"];

export function mapTechnology(row: TechnologyRow): Technology {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    iconUrl: row.icon_url,
    createdAt: row.created_at,
  };
}

export function mapExperience(row: ExperienceRow): Experience {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date,
    bullets: Array.isArray(row.bullets)
      ? row.bullets.filter((b): b is string => typeof b === "string")
      : [],
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProjectImage(row: ProjectImageJoinRow): ProjectImage {
  return {
    id: row.id,
    imageUrl: row.image_url,
    altText: row.alt_text,
    sortOrder: row.sort_order,
  };
}

export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    locale: row.locale as Locale,
    category: row.category,
    problem: row.problem,
    solution: row.solution,
    result: row.result,
    content: row.content,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    coverImageUrl: row.cover_image_url,
    featured: row.featured,
    status: row.status,
    sortOrder: row.sort_order,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoOgImage: row.seo_og_image,
    seoCanonical: row.seo_canonical,
    seoNoindex: row.seo_noindex,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    locale: row.locale as Article["locale"],
    excerpt: row.excerpt,
    content: row.content,
    tags: row.tags,
    coverImageUrl: row.cover_image_url,
    status: row.status,
    publishedAt: row.published_at,
    readingTimeMin: row.reading_time_min,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoOgImage: row.seo_og_image,
    seoCanonical: row.seo_canonical,
    seoNoindex: row.seo_noindex,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMediaAsset(row: MediaAssetRow): MediaAsset {
  return {
    id: row.id,
    filename: row.filename,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    altText: row.alt_text,
    createdAt: row.created_at,
  };
}

type ExperienceWithJoin = ExperienceRow & {
  experience_technologies: Array<{ technologies: TechnologyRow | null }>;
};

type ProjectWithJoin = ProjectRow & {
  project_technologies: Array<{ technologies: TechnologyRow | null }>;
  project_images?: ProjectImageJoinRow[];
};

export function mapExperienceWithTechnologies(
  row: ExperienceWithJoin,
): ExperienceWithTechnologies {
  const technologies = row.experience_technologies
    .map((link) => link.technologies)
    .filter((tech): tech is TechnologyRow => tech !== null)
    .map(mapTechnology);

  return {
    ...mapExperience(row),
    technologies,
  };
}

export function mapProjectWithTechnologies(
  row: ProjectWithJoin,
): ProjectWithTechnologies {
  const technologies = (row.project_technologies ?? [])
    .map((link) => link.technologies)
    .filter((tech): tech is TechnologyRow => tech !== null)
    .map(mapTechnology);

  const images = (row.project_images ?? [])
    .map(mapProjectImage)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return projectWithTechnologiesSchema.parse({
    ...mapProject(row),
    technologies,
    images,
  });
}
