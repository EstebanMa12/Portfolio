"use client";

import { useState } from "react";
import { ExperienceBullet } from "@/components/public/experience-bullet";
import { TechnologyBadge } from "@/components/public/technology-badge";
import { getCompanyInitials } from "@/lib/utils/experience-timeline";
import { cn } from "@/lib/utils/cn";
import type { ExperienceTimelineItem } from "@/lib/domain/experience/experience-timeline-types";

const MAX_VISIBLE_TECHNOLOGIES = 8;

type ExperienceCardInteractiveProps = {
  item: ExperienceTimelineItem;
  index: number;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  labels: {
    present: string;
    currentRole: string;
    stack: string;
    expandRole: string;
    collapseRole: string;
    showLessTech: string;
  };
};

export function ExperienceCardInteractive({
  item,
  index,
  isActive,
  isExpanded,
  onToggleExpanded,
  labels,
}: Readonly<ExperienceCardInteractiveProps>) {
  const [techExpanded, setTechExpanded] = useState(false);
  const initials = getCompanyInitials(item.company);
  const accentVariant = index % 2 === 0 ? "accent" : "teal";
  const headingId = `experience-role-${item.id}`;
  const canCollapse = !item.isCurrent;
  const showDetails = item.isCurrent || isExpanded;
  const hiddenTechnologyCount = Math.max(
    0,
    item.technologies.length - MAX_VISIBLE_TECHNOLOGIES,
  );
  const visibleTechnologies = techExpanded
    ? item.technologies
    : item.technologies.slice(0, MAX_VISIBLE_TECHNOLOGIES);

  return (
    <article
      className={cn(
        "experience-card card group",
        item.isCurrent && "experience-card--current",
        isActive && "experience-card--active",
        !showDetails && canCollapse && "experience-card--collapsed",
      )}
      aria-labelledby={headingId}
    >
      <div className="experience-card-glow" aria-hidden="true" />

      <header className="experience-card-header">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div
            className={cn(
              "experience-company-badge shrink-0",
              accentVariant === "accent"
                ? "experience-company-badge--accent"
                : "experience-company-badge--teal",
            )}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                {item.company}
              </p>
              {item.isCurrent ? (
                <span className="experience-current-badge">
                  <span
                    className="experience-current-dot availability-pulse"
                    aria-hidden="true"
                  />
                  {labels.present}
                </span>
              ) : null}
            </div>
            <h3
              id={headingId}
              className="font-display text-xl md:text-2xl font-semibold tracking-tight text-text-primary leading-snug"
            >
              {item.role}
            </h3>
          </div>
        </div>

        <div className="experience-period-block">
          <p className="experience-period-year font-display" aria-hidden="true">
            {item.startYear}
          </p>
          <time
            className="experience-period-range"
            dateTime={item.periodDatetime}
          >
            {item.periodLabel}
          </time>
          <p className="experience-period-duration">{item.durationLabel}</p>
        </div>
      </header>

      {canCollapse ? (
        <div className="mb-4">
          <button
            type="button"
            className="experience-toggle"
            aria-expanded={showDetails}
            aria-controls={`experience-details-${item.id}`}
            onClick={onToggleExpanded}
          >
            {showDetails ? labels.collapseRole : labels.expandRole}
            {!showDetails && item.bullets.length > 0 ? (
              <span className="text-text-muted font-normal">
                {" "}
                · {item.bullets.length}
              </span>
            ) : null}
          </button>
        </div>
      ) : null}

      {showDetails ? (
        <div id={`experience-details-${item.id}`}>
          {item.bullets.length > 0 ? (
            <ul className="experience-bullets mb-5">
              {item.bullets.map((bullet, bulletIndex) => (
                <li key={`${item.id}-${bulletIndex}`}>
                  <span className="experience-bullet-index" aria-hidden="true">
                    {String(bulletIndex + 1).padStart(2, "0")}
                  </span>
                  <ExperienceBullet text={bullet} />
                </li>
              ))}
            </ul>
          ) : null}

          {item.technologies.length > 0 ? (
            <footer className="experience-stack">
              <p className="experience-stack-label">{labels.stack}</p>
              <div className="flex flex-wrap gap-2">
                {visibleTechnologies.map((tech) => (
                  <TechnologyBadge key={tech.id} tech={tech} />
                ))}
                {hiddenTechnologyCount > 0 ? (
                  <button
                    type="button"
                    className="badge text-text-muted hover:text-text-primary transition-colors"
                    aria-expanded={techExpanded}
                    onClick={() => setTechExpanded((prev) => !prev)}
                  >
                    {techExpanded
                      ? labels.showLessTech
                      : item.moreTechnologiesLabel}
                  </button>
                ) : null}
              </div>
            </footer>
          ) : null}
        </div>
      ) : null}

      {item.isCurrent ? (
        <span className="sr-only">{labels.currentRole}</span>
      ) : null}
    </article>
  );
}
