import { getTranslations } from "next-intl/server";
import {
  ProjectImageCarousel,
} from "@/components/public/project-image-carousel";
import {
  getProjectTitleInitials,
  resolveProjectMedia,
} from "@/lib/domain/projects/resolve-project-media";
import type { ProjectWithTechnologies } from "@/lib/schemas/project";
import { cn } from "@/lib/utils/cn";

type ProjectCardMediaProps = {
  project: Pick<
    ProjectWithTechnologies,
    "title" | "category" | "images" | "coverImageUrl"
  >;
  className?: string;
};

export async function ProjectCardMedia({
  project,
  className,
}: Readonly<ProjectCardMediaProps>) {
  const media = resolveProjectMedia(project);

  if (media.images.length > 0) {
    return (
      <div className={cn("project-card-media", className)}>
        <ProjectImageCarousel
          images={media.images}
          title={project.title}
          className="mb-0"
        />
      </div>
    );
  }

  const t = await getTranslations("projects");
  const initials = getProjectTitleInitials(project.title);

  return (
    <div className={cn("project-card-media", className)}>
      <div
        className="project-card-placeholder"
        role="img"
        aria-label={t("noPreview", { title: project.title })}
      >
        <span className="project-card-placeholder-category">
          {project.category}
        </span>
        <span className="project-card-placeholder-initials">{initials}</span>
      </div>
    </div>
  );
}
