import { Badge } from "@/components/public/badge";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";
import { formatExperiencePeriod } from "@/lib/utils/format-date";

type ExperienceCardProps = {
  experience: ExperienceWithTechnologies;
  isFirst?: boolean;
};

export function ExperienceCard({
  experience,
  isFirst = false,
}: ExperienceCardProps) {
  const period = formatExperiencePeriod(
    experience.startDate,
    experience.endDate,
  );

  return (
    <article className="card card-interactive">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
        <time
          className="text-text-muted text-sm font-medium"
          dateTime={period.datetime}
        >
          {period.label}
        </time>
        <span className="text-text-muted text-sm" aria-hidden="true">
          ·
        </span>
        <span className="text-text-primary font-semibold">
          {experience.company}
        </span>
      </div>

      <h3 className="text-lg font-medium text-text-primary mb-3">
        {experience.role}
      </h3>

      {experience.bullets.length > 0 ? (
        <ul className="space-y-2 text-text-secondary text-sm leading-relaxed mb-4 list-disc pl-4">
          {experience.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}

      {experience.technologies.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <Badge key={tech.id}>{tech.name}</Badge>
          ))}
        </div>
      ) : null}

      {isFirst ? (
        <span className="sr-only">Rol actual</span>
      ) : null}
    </article>
  );
}

type ExperienceTimelineProps = {
  experiences: ExperienceWithTechnologies[];
};

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  if (experiences.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        No hay experiencia publicada todavía.
      </p>
    );
  }

  return (
    <ol className="relative space-y-8 border-l border-border ml-3 pl-8">
      {experiences.map((experience, index) => (
        <li key={experience.id} className="relative">
          <span
            className={`absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-bg ${
              index === 0 ? "bg-accent availability-pulse" : "bg-text-muted"
            }`}
            aria-hidden="true"
          />
          <RevealOnScroll delay={index * 100}>
            <ExperienceCard experience={experience} isFirst={index === 0} />
          </RevealOnScroll>
        </li>
      ))}
    </ol>
  );
}
