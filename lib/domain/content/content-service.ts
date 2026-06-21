import * as articleRepo from "@/lib/repositories/article-repo";
import * as projectRepo from "@/lib/repositories/project-repo";
import * as technologyRepo from "@/lib/repositories/technology-repo";
import { revalidateEntity } from "@/lib/revalidate";
import { slugify, withCollisionSuffix } from "@/lib/utils/slug";
import { computeReadingTime } from "@/lib/utils/reading-time";

export type SlugEntity = "project" | "article" | "technology";

const slugCheckers: Record<
  SlugEntity,
  (slug: string, excludeId?: string) => Promise<boolean>
> = {
  project: (slug, excludeId) => projectRepo.slugExists(slug, { excludeId }),
  article: articleRepo.slugExists,
  technology: technologyRepo.slugExists,
};

export function generateSlug(title: string): string {
  const slug = slugify(title);
  return slug || "untitled";
}

export async function ensureUniqueSlug(
  title: string,
  entity: SlugEntity,
  excludeId?: string,
): Promise<string> {
  const baseSlug = generateSlug(title);
  const exists = slugCheckers[entity];

  for (let attempt = 1; attempt <= 100; attempt += 1) {
    const candidate = withCollisionSuffix(baseSlug, attempt);
    const taken = await exists(candidate, excludeId);
    if (!taken) {
      return candidate;
    }
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function publishProject(id: string) {
  const project = await projectRepo.getById(id, true);
  if (!project) {
    throw new Error("Project not found");
  }

  const updated = await projectRepo.update(id, {
    status: "published",
  });

  await revalidateEntity("project", { slug: updated.slug });
  return updated;
}

export async function publishArticle(id: string) {
  const article = await articleRepo.getById(id, true);
  if (!article) {
    throw new Error("Article not found");
  }

  const readingTimeMin = computeReadingTime(article.content);
  const updated = await articleRepo.update(id, {
    status: "published",
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    readingTimeMin,
  });

  await revalidateEntity("article", { slug: updated.slug });
  return updated;
}

export { computeReadingTime };
