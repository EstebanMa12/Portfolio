"use client";

import Image from "next/image";
import { useCallback, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { TechCategory } from "@/lib/schemas/common";
import type { Technology } from "@/lib/schemas/technology";
import { cn } from "@/lib/utils/cn";

type TechStackExplorerProps = {
  technologiesByCategory: Partial<Record<TechCategory, Technology[]>>;
  categories: TechCategory[];
};

function CategoryIcon({ category }: { category: TechCategory }) {
  const className = "w-4 h-4 shrink-0";

  switch (category) {
    case "language":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M8 6l-4 6 4 6M16 6l4 6-4 6M14 4l-4 16"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "framework":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="8"
            height="8"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <rect
            x="13"
            y="3"
            width="8"
            height="8"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <rect
            x="8"
            y="13"
            width="8"
            height="8"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
        </svg>
      );
    case "database":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
    case "infra":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 8h16v10H4zM8 8V5h8v3M12 12v2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "tool":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.1 2.1-3.2-3.2 2.1-2.1z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function TechChip({
  tech,
  index,
  animate,
}: {
  tech: Technology;
  index: number;
  animate: boolean;
}) {
  const initials = tech.name
    .split(/[\s./]+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <li
      className={cn("tech-chip", animate && "tech-chip-enter")}
      style={animate ? { animationDelay: `${index * 45}ms` } : undefined}
    >
      <span className="tech-chip-icon" aria-hidden="true">
        {tech.iconUrl ? (
          <Image
            src={tech.iconUrl}
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
        ) : (
          <span className="tech-chip-initial">{initials}</span>
        )}
      </span>
      <span className="tech-chip-name">{tech.name}</span>
    </li>
  );
}

function DistributionBar({
  categories,
  technologiesByCategory,
  activeCategory,
  onSelect,
  getLabel,
  totalLabel,
}: {
  categories: TechCategory[];
  technologiesByCategory: Partial<Record<TechCategory, Technology[]>>;
  activeCategory: TechCategory;
  onSelect: (category: TechCategory) => void;
  getLabel: (category: TechCategory) => string;
  totalLabel: string;
}) {
  const total = categories.reduce(
    (sum, category) => sum + (technologiesByCategory[category]?.length ?? 0),
    0,
  );

  if (total === 0) return null;

  return (
    <div
      className="tech-stack-distribution"
      role="img"
      aria-label={totalLabel}
    >
      {categories.map((category) => {
        const count = technologiesByCategory[category]?.length ?? 0;

        return (
          <button
            key={category}
            type="button"
            className={cn(
              "tech-stack-segment",
              activeCategory === category && "is-active",
            )}
            data-category={category}
            style={{ flex: `${count} 1 0` }}
            onClick={() => onSelect(category)}
            aria-label={`${getLabel(category)}: ${count}`}
            title={`${getLabel(category)} (${count})`}
          >
            <span className="tech-stack-segment-fill" />
          </button>
        );
      })}
    </div>
  );
}

export function TechStackExplorer({
  technologiesByCategory,
  categories,
}: TechStackExplorerProps) {
  const t = useTranslations("skills");
  const tablistId = useId();
  const panelId = useId();
  const reducedMotion = usePrefersReducedMotion();
  const [activeCategory, setActiveCategory] = useState<TechCategory>(
    () => categories[0]!,
  );
  const [animationKey, setAnimationKey] = useState(0);

  const getLabel = useCallback(
    (category: TechCategory) => t(`categories.${category}`),
    [t],
  );

  const selectCategory = useCallback(
    (category: TechCategory) => {
      setActiveCategory(category);
      if (!reducedMotion) {
        setAnimationKey((key) => key + 1);
      }
    },
    [reducedMotion],
  );

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % categories.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + categories.length) % categories.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = categories.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const nextCategory = categories[nextIndex];
      if (nextCategory) {
        selectCategory(nextCategory);
        document.getElementById(`${tablistId}-${nextCategory}`)?.focus();
      }
    }
  };

  const activeItems = technologiesByCategory[activeCategory] ?? [];
  const totalTechnologies = categories.reduce(
    (sum, category) => sum + (technologiesByCategory[category]?.length ?? 0),
    0,
  );

  return (
    <div className="tech-stack-explorer">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            {t("stackByCategoryTitle")}
          </h3>
          <p className="mt-1 text-xs text-text-muted max-w-prose">
            {t("stackByCategoryDescription")}
          </p>
        </div>
        <p className="text-xs font-medium text-text-muted tabular-nums">
          {t("technologiesCount", { count: totalTechnologies })}
        </p>
      </div>

      <DistributionBar
        categories={categories}
        technologiesByCategory={technologiesByCategory}
        activeCategory={activeCategory}
        onSelect={selectCategory}
        getLabel={getLabel}
        totalLabel={t("technologiesCount", { count: totalTechnologies })}
      />

      <div
        role="tablist"
        aria-label={t("stackByCategoryTitle")}
        className="tech-stack-tabs"
      >
        {categories.map((category, index) => {
          const count = technologiesByCategory[category]?.length ?? 0;
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              id={`${tablistId}-${category}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              data-category={category}
              className={cn("tech-stack-tab", isActive && "is-active")}
              onClick={() => selectCategory(category)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <CategoryIcon category={category} />
              <span>{getLabel(category)}</span>
              <span className="tech-stack-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${tablistId}-${activeCategory}`}
        className="tech-stack-panel"
        data-category={activeCategory}
        key={activeCategory}
      >
        <div className="tech-stack-panel-glow" aria-hidden="true" />
        <header className="tech-stack-panel-header">
          <div className="tech-stack-panel-icon" aria-hidden="true">
            <CategoryIcon category={activeCategory} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              {getLabel(activeCategory)}
            </p>
            <p className="text-sm text-text-secondary mt-0.5">
              {t("categoryTechCount", { count: activeItems.length })}
            </p>
          </div>
        </header>

        <ul className="tech-stack-grid" key={animationKey}>
          {activeItems.map((tech, index) => (
            <TechChip
              key={tech.id}
              tech={tech}
              index={index}
              animate={!reducedMotion}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
