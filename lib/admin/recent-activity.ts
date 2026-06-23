import type { Article } from "@/lib/schemas/article";
import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";
import type { ProjectWithTechnologies } from "@/lib/schemas/project";

export type AdminActivityEntity = "project" | "article" | "experience";

export type AdminActivityItem = {
  id: string;
  entityType: AdminActivityEntity;
  entityLabel: string;
  title: string;
  href: string;
  status?: "draft" | "published";
  updatedAt: string;
};

const ENTITY_LABELS: Record<AdminActivityEntity, string> = {
  project: "Proyecto",
  article: "Artículo",
  experience: "Experiencia",
};

function fromProjects(projects: ProjectWithTechnologies[]): AdminActivityItem[] {
  return projects.map((project) => ({
    id: project.id,
    entityType: "project",
    entityLabel: ENTITY_LABELS.project,
    title: project.title,
    href: `/admin/projects/${project.id}`,
    status: project.status,
    updatedAt: project.updatedAt,
  }));
}

function fromArticles(articles: Article[]): AdminActivityItem[] {
  return articles.map((article) => ({
    id: article.id,
    entityType: "article",
    entityLabel: ENTITY_LABELS.article,
    title: article.title,
    href: `/admin/articles/${article.id}`,
    status: article.status,
    updatedAt: article.updatedAt,
  }));
}

function fromExperiences(
  experiences: ExperienceWithTechnologies[],
): AdminActivityItem[] {
  return experiences.map((experience) => ({
    id: experience.id,
    entityType: "experience",
    entityLabel: ENTITY_LABELS.experience,
    title: `${experience.role} · ${experience.company}`,
    href: `/admin/experience/${experience.id}`,
    updatedAt: experience.updatedAt,
  }));
}

export function buildRecentActivity(
  input: {
    projects: ProjectWithTechnologies[];
    articles: Article[];
    experiences: ExperienceWithTechnologies[];
  },
  limit = 10,
): AdminActivityItem[] {
  return [
    ...fromProjects(input.projects),
    ...fromArticles(input.articles),
    ...fromExperiences(input.experiences),
  ]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}
