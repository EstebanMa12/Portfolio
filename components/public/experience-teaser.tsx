import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/public/badge";
import { SectionHeader } from "@/components/public/section-header";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";
import type { Locale } from "@/lib/i18n/config";
import {
  getCompanyInitials,
  getCurrentExperience,
  splitBulletMetrics,
} from "@/lib/utils/experience-timeline";
import { formatExperiencePeriod } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils/cn";

type ExperienceTeaserProps = {
  experiences: ExperienceWithTechnologies[];
};

function TeaserBullet({ text }: Readonly<{ text: string }>) {
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

export async function ExperienceTeaser({
  experiences,
}: Readonly<ExperienceTeaserProps>) {
  const current = getCurrentExperience(experiences);
  if (!current) return null;

  const locale = (await getLocale()) as Locale;
  const tSections = await getTranslations({ locale, namespace: "sections" });
  const tExp = await getTranslations({ locale, namespace: "experience" });

  const period = formatExperiencePeriod(
    current.startDate,
    current.endDate,
    tExp("present"),
  );
  const isCurrent = !current.endDate;
  const bullets = current.bullets.slice(0, 2);
  const initials = getCompanyInitials(current.company);

  return (
    <section
      id="experience"
      aria-labelledby="experience-teaser-heading"
      className="mb-section-gap-mobile md:mb-section-gap scroll-mt-28"
    >
      <RevealOnScroll>
        <SectionHeader
          label={tSections("experienceLabel")}
          title={tSections("experienceTitle")}
          description={tSections("experienceDescription")}
          href="/experience"
          linkLabel={tSections("experienceLink")}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={80}>
        <article className="card p-6 md:p-8">
          <div className="flex gap-4 md:gap-6">
            <div
              className={cn(
                "experience-company-badge shrink-0",
                "experience-company-badge--accent",
              )}
              aria-hidden="true"
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {isCurrent ? <Badge>{tExp("currentRole")}</Badge> : null}
                <time
                  className="text-sm text-text-muted"
                  dateTime={period.datetime}
                >
                  {period.label}
                </time>
              </div>

              <h3
                id="experience-teaser-heading"
                className="font-display text-xl md:text-2xl font-semibold tracking-tight text-text-primary"
              >
                {current.role}
              </h3>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-text-muted">
                {current.company}
              </p>

              {bullets.length > 0 ? (
                <ul
                  className="mt-4 space-y-2 text-sm text-text-secondary leading-relaxed"
                  role="list"
                >
                  {bullets.map((bullet, bulletIndex) => (
                    <li
                      key={`${current.id}-${bulletIndex}`}
                      className="flex gap-2"
                    >
                      <span className="text-accent shrink-0" aria-hidden="true">
                        ·
                      </span>
                      <TeaserBullet text={bullet} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </article>
      </RevealOnScroll>
    </section>
  );
}
