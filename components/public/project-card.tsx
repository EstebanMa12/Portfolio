import { getTranslations } from "next-intl/server";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in-view";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Card } from "@/components/public/card";
import { GitHubIcon } from "@/components/public/icons";
import { ProjectCardMedia } from "@/components/public/project-card-media";
import { SectionHeader } from "@/components/public/section-header";
import { TechnologyBadge } from "@/components/public/technology-badge";
import { textLinkClassName } from "@/components/public/text-link";
import type { ProjectWithTechnologies } from "@/lib/schemas/project";
import { cn } from "@/lib/utils/cn";

type ProjectCardProps = {
  project: ProjectWithTechnologies;
  featured?: boolean;
  showFeaturedBadge?: boolean;
  featuredLabel?: string;
  githubLabel: string;
  demoLabel: string;
  problemLabel: string;
  solutionLabel: string;
  stackLabel: string;
  resultLabel: string;
};

export async function ProjectCard({
  project,
  featured = false,
  showFeaturedBadge = false,
  featuredLabel,
  githubLabel,
  demoLabel,
  problemLabel,
  solutionLabel,
  stackLabel,
  resultLabel,
}: Readonly<ProjectCardProps>) {
  const showBadge = showFeaturedBadge && project.featured && featuredLabel;

  return (
    <Card
      as="article"
      className={cn(
        "lab-card project-card flex flex-col overflow-hidden h-full",
        featured && "project-card--featured",
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-xs font-medium text-accent">{project.category}</p>
        {showBadge ? (
          <span className="project-card-featured-badge shrink-0">
            {featuredLabel}
          </span>
        ) : null}
      </div>

      <ProjectCardMedia
        project={project}
        className="-mx-6 md:-mx-8 mb-4"
      />

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
          <dd className="metric-highlight rounded-md px-3 py-2 text-text-primary font-medium">
            {project.result}
          </dd>
        </div>
      </dl>

      {(project.githubUrl || project.demoUrl) && (
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                textLinkClassName,
                "inline-flex items-center gap-1.5 text-sm font-medium",
              )}
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
              className={cn(textLinkClassName, "inline-flex text-sm font-medium")}
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
  showFeaturedBadge?: boolean;
};

export async function ProjectGrid({
  projects,
  showFeaturedBadge = false,
}: ProjectGridProps) {
  const t = await getTranslations("projects");

  if (projects.length === 0) {
    return <p className="text-text-secondary text-sm">{t("empty")}</p>;
  }

  return (
    <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((project) => (
        <StaggerItem key={project.id}>
          <ProjectCard
            project={project}
            featured={showFeaturedBadge && project.featured}
            showFeaturedBadge={showFeaturedBadge}
            featuredLabel={t("featured")}
            githubLabel={t("github")}
            demoLabel={t("demo")}
            problemLabel={t("problem")}
            solutionLabel={t("solution")}
            stackLabel={t("stack")}
            resultLabel={t("result")}
          />
        </StaggerItem>
      ))}
    </StaggerContainer>
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
      <ProjectGrid projects={projects} showFeaturedBadge />
    </section>
  );
}
