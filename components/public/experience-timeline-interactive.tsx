"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ExperienceCardInteractive } from "@/components/public/experience-card-interactive";
import type {
  ExperienceTimelineItem,
  ExperienceTimelineLabels,
  ExperienceTimelineSummary,
} from "@/lib/domain/experience/experience-timeline-types";
import { cn } from "@/lib/utils/cn";

type ExperienceTimelineInteractiveProps = {
  items: ExperienceTimelineItem[];
  summary: ExperienceTimelineSummary;
  labels: ExperienceTimelineLabels;
};

function getEntryId(experienceId: string) {
  return `experience-entry-${experienceId}`;
}

export function ExperienceTimelineInteractive({
  items,
  summary,
  labels,
}: Readonly<ExperienceTimelineInteractiveProps>) {
  const navId = useId();
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const current = items.find((item) => item.isCurrent);
    return new Set(current ? [current.id] : items[0] ? [items[0].id] : []);
  });
  const isScrollingRef = useRef(false);

  const expandRole = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const scrollToRole = useCallback(
    (id: string) => {
      expandRole(id);
      setActiveId(id);
      isScrollingRef.current = true;

      const target = document.getElementById(getEntryId(id));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });

      window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 700);
    },
    [expandRole],
  );

  useEffect(() => {
    const entryElements = items
      .map((item) => document.getElementById(getEntryId(item.id)))
      .filter((element): element is HTMLElement => element !== null);

    if (entryElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topEntry = visible[0];
        if (!topEntry) return;

        const id = topEntry.target.getAttribute("data-experience-id");
        if (id) setActiveId(id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    entryElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  const handleNavKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextItem = items[nextIndex];
    if (!nextItem) return;

    scrollToRole(nextItem.id);
    document.getElementById(`${navId}-${nextItem.id}`)?.focus();
  };

  return (
    <div className="experience-timeline">
      <div
        className="experience-summary"
        role="group"
        aria-label={labels.summaryLabel}
      >
        <div className="experience-summary-stat">
          <p className="experience-summary-label">{labels.yearsInIndustry}</p>
          <p className="experience-summary-value font-display tabular-nums">
            {summary.spanYears}+
          </p>
        </div>
        <div className="experience-summary-divider" aria-hidden="true" />
        <div className="experience-summary-stat">
          <p className="experience-summary-label">{labels.roles}</p>
          <p className="experience-summary-value font-display tabular-nums">
            {summary.roleCount}
          </p>
        </div>
        <div className="experience-summary-divider" aria-hidden="true" />
        <div className="experience-summary-stat">
          <p className="experience-summary-label">{labels.technologiesUsed}</p>
          <p className="experience-summary-value font-display tabular-nums">
            {summary.techCount}
          </p>
        </div>
      </div>

      {items.length > 1 ? (
        <nav
          className="experience-role-nav"
          aria-label={labels.roleNavLabel}
          role="tablist"
        >
          {items.map((item, index) => {
            const isSelected = activeId === item.id;

            return (
              <button
                key={item.id}
                id={`${navId}-${item.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={getEntryId(item.id)}
                tabIndex={isSelected ? 0 : -1}
                className={cn(
                  "experience-role-chip",
                  isSelected && "is-active",
                  item.isCurrent && "is-current",
                )}
                onClick={() => scrollToRole(item.id)}
                onKeyDown={(event) => handleNavKeyDown(event, index)}
              >
                <span className="experience-role-chip-company">{item.company}</span>
                <span className="experience-role-chip-meta">
                  {item.startYear}
                  {item.isCurrent ? ` · ${labels.present}` : ""}
                </span>
              </button>
            );
          })}
        </nav>
      ) : null}

      <div className="experience-spine-wrap">
        <div className="experience-spine" aria-hidden="true">
          <div className="experience-spine-glow" />
        </div>

        <ol className="experience-entries" aria-label={labels.timelineLabel}>
          {items.map((item, index) => {
            const isActive = activeId === item.id;

            return (
              <li
                key={item.id}
                id={getEntryId(item.id)}
                data-experience-id={item.id}
                className={cn(
                  "experience-entry scroll-mt-28",
                  isActive && "experience-entry--active",
                )}
                {...(item.isCurrent ? { "aria-current": "true" as const } : {})}
              >
                <div className="experience-node-column" aria-hidden="true">
                  <span
                    className={cn(
                      "experience-node",
                      item.isCurrent &&
                        "experience-node--current availability-pulse",
                      isActive && "experience-node--active",
                    )}
                  />
                  <span className="experience-node-year">{item.startYear}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <ExperienceCardInteractive
                    item={item}
                    index={index}
                    isActive={isActive}
                    isExpanded={item.isCurrent || expandedIds.has(item.id)}
                    onToggleExpanded={() => toggleExpanded(item.id)}
                    labels={{
                      present: labels.present,
                      currentRole: labels.currentRole,
                      stack: labels.stack,
                      expandRole: labels.expandRole,
                      collapseRole: labels.collapseRole,
                      showLessTech: labels.showLessTech,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
