import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Card } from "@/components/public/card";
import { GitHubIcon } from "@/components/public/icons";
import { ProjectImageCarousel } from "@/components/public/project-image-carousel";
import { SectionHeader } from "@/components/public/section-header";
import { TechnologyBadge } from "@/components/public/technology-badge";
import type { ProjectWithTechnologies } from "@/lib/schemas/project";

type ProjectCardProps = {
  project: ProjectWithTechnologies;
  featured?: boolean;
  githubLabel: string;
  demoLabel: string;
  problemLabel: string;
  solutionLabel: string;
  stackLabel: string;
  resultLabel: string;
};

export function ProjectCard({
  project,
  featured = false,
  githubLabel,
  demoLabel,
  problemLabel,
  solutionLabel,
  stackLabel,
  resultLabel,
}: Readonly<ProjectCardProps>) {
  return (
    <Card
      as="article"
      className={`flex flex-col ${featured ? "" : "h-full"}`}
    >
      <ProjectImageCarousel
        images={(project.images ?? []).map((image) => ({
          url: image.imageUrl,
          alt: image.altText,
        }))}
        title={project.title}
      />
      <p className="text-xs font-medium text-accent mb-2">{project.category}</p>
      <h3 className="text-xl font-semibold text-text-primary mb-4">
        {project.title}
      </h3>

      <dl className="space-y-3 text-sm flex-1">
        <div>
          <dt className="text-text-muted font-medium mb-1">{problemLabel}</dt>
          <dd className="text-text-secondary leading-relaxed">
            {project.problem}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted font-medium mb-1">{solutionLabel}</dt>
          <dd className="text-text-secondary leading-relaxed">
            {project.solution}
          </dd>
        </div>
        {project.technologies?.length ? (
          <div>
            <dt className="text-text-muted font-medium mb-1">{stackLabel}</dt>
            <dd className="flex flex-wrap gap-2 mt-1">
              {project.technologies.map((tech) => (
                <TechnologyBadge key={tech.id} tech={tech} />
              ))}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-text-muted font-medium mb-1">{resultLabel}</dt>
          <dd className="text-text-primary font-medium">{project.result}</dd>
        </div>
      </dl>

      {(project.githubUrl || project.demoUrl) && (
        <div className="flex gap-4 mt-6 pt-4 border-t border-border">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              {githubLabel}
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {demoLabel}
            </a>
          ) : null}
        </div>
      )}
    </Card>
  );
}

type ProjectGridProps = {
  projects: ProjectWithTechnologies[];
};

export async function ProjectGrid({ projects }: ProjectGridProps) {
  const t = await getTranslations("projects");

  if (projects.length === 0) {
    return <p className="text-text-secondary text-sm">{t("empty")}</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <RevealOnScroll key={project.id} delay={index * 90}>
          <ProjectCard
            project={project}
            githubLabel={t("github")}
            demoLabel={t("demo")}
            problemLabel={t("problem")}
            solutionLabel={t("solution")}
            stackLabel={t("stack")}
            resultLabel={t("result")}
          />
        </RevealOnScroll>
      ))}
    </div>
  );
}

type FeaturedProjectsProps = {
  projects: ProjectWithTechnologies[];
};

export async function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = await getTranslations("sections");

  return (
    <section
      id="projects"
      aria-labelledby="featured-projects-heading"
      className="mb-section-gap-mobile md:mb-section-gap scroll-mt-28"
    >
      <RevealOnScroll>
        <SectionHeader
          label={t("projectsLabel")}
          title={t("projectsTitle")}
          href="/projects"
          linkLabel={t("projectsLink")}
        />
      </RevealOnScroll>
      <h2 id="featured-projects-heading" className="sr-only">
        {t("projectsTitle")}
      </h2>
      <ProjectGrid projects={projects} />
    </section>
  );
}
