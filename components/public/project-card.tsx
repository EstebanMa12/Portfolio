import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Badge } from "@/components/public/badge";
import { Card } from "@/components/public/card";
import { GitHubIcon } from "@/components/public/icons";
import { SectionHeader } from "@/components/public/section-header";
import type { ProjectWithTechnologies } from "@/lib/schemas/project";

type ProjectCardProps = {
  project: ProjectWithTechnologies;
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <Card
      as="article"
      interactive
      className={`flex flex-col ${featured ? "" : "h-full"}`}
    >
      <p className="text-xs font-medium text-accent mb-2">{project.category}</p>
      <h3 className="text-xl font-semibold text-text-primary mb-4">
        {project.title}
      </h3>

      <dl className="space-y-3 text-sm flex-1">
        <div>
          <dt className="text-text-muted font-medium mb-1">Problema</dt>
          <dd className="text-text-secondary leading-relaxed">
            {project.problem}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted font-medium mb-1">Solución</dt>
          <dd className="text-text-secondary leading-relaxed">
            {project.solution}
          </dd>
        </div>
        {project.technologies.length > 0 ? (
          <div>
            <dt className="text-text-muted font-medium mb-1">Stack</dt>
            <dd className="flex flex-wrap gap-2 mt-1">
              {project.technologies.map((tech) => (
                <Badge key={tech.id}>{tech.name}</Badge>
              ))}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-text-muted font-medium mb-1">Resultado</dt>
          <dd className="text-text-primary font-medium">{project.result}</dd>
        </div>
      </dl>

      {(project.githubUrl || project.demoUrl) && (
        <div className="flex gap-4 mt-6 pt-4 border-t border-border">
          {project.githubUrl ? (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              GitHub
            </Link>
          ) : null}
          {project.demoUrl ? (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Demo
            </Link>
          ) : null}
        </div>
      )}
    </Card>
  );
}

type ProjectGridProps = {
  projects: ProjectWithTechnologies[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        No hay proyectos publicados todavía.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <RevealOnScroll key={project.id} delay={index * 90}>
          <ProjectCard project={project} />
        </RevealOnScroll>
      ))}
    </div>
  );
}

type FeaturedProjectsProps = {
  projects: ProjectWithTechnologies[];
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section
      id="projects"
      aria-labelledby="featured-projects-heading"
      className="mb-section-gap-mobile md:mb-section-gap scroll-mt-28"
    >
      <RevealOnScroll>
        <SectionHeader
          label="Proyectos"
          title="Trabajo seleccionado"
          href="/projects"
          linkLabel="Ver todos →"
        />
      </RevealOnScroll>
      <h2 id="featured-projects-heading" className="sr-only">
        Proyectos destacados
      </h2>
      <ProjectGrid projects={projects} />
    </section>
  );
}
