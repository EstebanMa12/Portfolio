import { Badge } from "@/components/public/badge";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";
import {
  getCareerSummary,
  getCompanyInitials,
  getExperienceDurationMonths,
  getExperienceStartYear,
  splitBulletMetrics,
} from "@/lib/utils/experience-timeline";
import { formatExperiencePeriod } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils/cn";
import { getLocale, getTranslations } from "next-intl/server";

type ExperienceCardProps = {
  experience: ExperienceWithTechnologies;
  index: number;
  isCurrent: boolean;
  presentLabel: string;
  currentRoleLabel: string;
  stackLabel: string;
  durationLabel: string;
};

function ExperienceBullet({ text }: Readonly<{ text: string }>) {
  const parts = splitBulletMetrics(text);

  return (
    <span>
      {parts.map((part, partIndex) =>
        part.metric ? (
          <span
            key={`${partIndex}-${part.text}`}
            className="font-medium text-metric-teal"
          >
            {part.text}
          </span>
        ) : (
          <span key={`${partIndex}-${part.text}`}>{part.text}</span>
        ),
      )}
    </span>
  );
}

function ExperienceCard({
  experience,
  index,
  isCurrent,
  presentLabel,
  currentRoleLabel,
  stackLabel,
  durationLabel,
}: Readonly<ExperienceCardProps>) {
  const period = formatExperiencePeriod(
    experience.startDate,
    experience.endDate,
  );
  const startYear = getExperienceStartYear(experience.startDate);
  const initials = getCompanyInitials(experience.company);
  const accentVariant = index % 2 === 0 ? "accent" : "teal";

  return (
    <article
      className={cn(
        "experience-card card card-interactive group",
        isCurrent && "experience-card--current",
      )}
    >
      <div className="experience-card-glow" aria-hidden="true" />

      <header className="flex flex-wrap items-start gap-4 mb-5">
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
              {experience.company}
            </p>
            {isCurrent ? (
              <span className="experience-current-badge">
                <span
                  className="experience-current-dot availability-pulse"
                  aria-hidden="true"
                />
                {presentLabel}
              </span>
            ) : null}
          </div>
          <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-text-primary leading-snug">
            {experience.role}
          </h3>
        </div>

        <div className="experience-period-block shrink-0 text-right">
          <time
            className="block font-display text-2xl font-semibold text-text-primary leading-none"
            dateTime={period.datetime}
          >
            {startYear}
          </time>
          <p className="mt-1 text-xs text-text-muted">{period.label}</p>
          <p className="mt-1 text-xs font-medium text-accent">
            {durationLabel}
          </p>
        </div>
      </header>

      {experience.bullets.length > 0 ? (
        <ul className="experience-bullets mb-5">
          {experience.bullets.map((bullet, bulletIndex) => (
            <li key={bullet}>
              <span className="experience-bullet-index" aria-hidden="true">
                {String(bulletIndex + 1).padStart(2, "0")}
              </span>
              <ExperienceBullet text={bullet} />
            </li>
          ))}
        </ul>
      ) : null}

      {experience.technologies.length > 0 ? (
        <footer className="experience-stack">
          <p className="experience-stack-label">{stackLabel}</p>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <Badge key={tech.id}>{tech.name}</Badge>
            ))}
          </div>
        </footer>
      ) : null}

      {isCurrent ? (
        <span className="sr-only">{currentRoleLabel}</span>
      ) : null}
    </article>
  );
}

type ExperienceTimelineProps = {
  experiences: ExperienceWithTechnologies[];
};

export async function ExperienceTimeline({
  experiences,
}: Readonly<ExperienceTimelineProps>) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "experience" });
  const summary = getCareerSummary(experiences);

  const formatDuration = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return t("durationMixed", {
        years: t("durationYears", { count: years }),
        months: t("durationMonths", { count: remainingMonths }),
      });
    }

    if (years > 0) {
      return t("durationYears", { count: years });
    }

    return t("durationMonths", { count: remainingMonths || months });
  };

  if (experiences.length === 0) {
    return (
      <p className="text-text-secondary text-sm">{t("empty")}</p>
    );
  }

  return (
    <div className="experience-timeline">
      <RevealOnScroll>
        <dl className="experience-summary" aria-label={t("summaryLabel")}>
          <div className="experience-summary-stat">
            <dt className="experience-summary-label">{t("yearsInIndustry")}</dt>
            <dd className="experience-summary-value font-display">
              {summary.spanYears}+
            </dd>
          </div>
          <div className="experience-summary-divider" aria-hidden="true" />
          <div className="experience-summary-stat">
            <dt className="experience-summary-label">{t("roles")}</dt>
            <dd className="experience-summary-value font-display">
              {summary.roleCount}
            </dd>
          </div>
          <div className="experience-summary-divider" aria-hidden="true" />
          <div className="experience-summary-stat">
            <dt className="experience-summary-label">{t("technologiesUsed")}</dt>
            <dd className="experience-summary-value font-display">
              {summary.techCount}
            </dd>
          </div>
        </dl>
      </RevealOnScroll>

      <div className="experience-spine-wrap">
        <div className="experience-spine" aria-hidden="true">
          <div className="experience-spine-glow" />
        </div>

        <ol className="experience-entries">
          {experiences.map((experience, index) => {
            const isCurrent = index === 0 && !experience.endDate;
            const durationMonths = getExperienceDurationMonths(
              experience.startDate,
              experience.endDate,
            );

            return (
              <li key={experience.id} className="experience-entry">
                <div className="experience-node-column" aria-hidden="true">
                  <span
                    className={cn(
                      "experience-node",
                      isCurrent && "experience-node--active availability-pulse",
                    )}
                  />
                </div>

                <RevealOnScroll delay={index * 100} className="min-w-0 flex-1">
                  <ExperienceCard
                    experience={experience}
                    index={index}
                    isCurrent={isCurrent}
                    presentLabel={t("present")}
                    currentRoleLabel={t("currentRole")}
                    stackLabel={t("stack")}
                    durationLabel={formatDuration(durationMonths)}
                  />
                </RevealOnScroll>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
