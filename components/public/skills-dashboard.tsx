import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/public/badge";
import { Card } from "@/components/public/card";
import { MetricHighlight } from "@/components/public/metric-highlight";
import { SectionLabel } from "@/components/public/section-label";
import { TechStackExplorer } from "@/components/public/tech-stack-explorer";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { AboutContent, HeroContent } from "@/lib/schemas/page-content";
import type { Technology } from "@/lib/schemas/technology";
import type { TechCategory } from "@/lib/schemas/common";
import { getOrderedStackCategories } from "@/lib/utils/tech-categories";
import {
  DEFAULT_RADAR_SKILLS,
  getRadarDescription,
  getRadarGridLevels,
  getRadarGridPoints,
  getRadarLabelPosition,
  getRadarPolygonPoints,
  getRadarAxisEnd,
} from "@/lib/utils/radar-chart";

type SkillsDashboardProps = {
  metrics: HeroContent["metrics"];
  about: AboutContent;
  technologies: Technology[];
};

export async function SkillsDashboard({
  metrics,
  about,
  technologies,
}: Readonly<SkillsDashboardProps>) {
  const t = await getTranslations("skills");
  const softSkills = t.raw("softSkills") as string[];
  const radarSkills =
    about.skills && about.skills.length >= 3
      ? about.skills
      : DEFAULT_RADAR_SKILLS;
  const radarPoints = getRadarPolygonPoints(radarSkills);
  const radarDescription = getRadarDescription(radarSkills);

  const technologiesByCategory = technologies.reduce<
    Partial<Record<TechCategory, Technology[]>>
  >((groups, tech) => {
    const list = groups[tech.category] ?? [];
    list.push(tech);
    groups[tech.category] = list;
    return groups;
  }, {});

  const stackCategories = getOrderedStackCategories(technologiesByCategory);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="mb-section-gap-mobile md:mb-section-gap scroll-mt-28"
    >
      <RevealOnScroll>
        <SectionLabel className="mb-3">{t("sectionLabel")}</SectionLabel>
        <h2
          id="skills-heading"
          className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-10"
        >
          {t("sectionTitle")}
        </h2>
      </RevealOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-4 space-y-4">
          {metrics.slice(0, 3).map((metric, index) => (
            <RevealOnScroll key={metric.label} delay={index * 80}>
              {metric.variant === "highlight" ? (
                <MetricHighlight
                  label={metric.label}
                  value={metric.value}
                  detail={metric.description}
                />
              ) : (
                <Card>
                  <p className="text-text-muted text-xs font-medium uppercase tracking-wide">
                    {metric.label}
                  </p>
                  <p className="metric-value font-display text-2xl font-semibold text-text-primary mt-1">
                    {metric.value}
                  </p>
                  <p className="text-text-secondary text-xs mt-1">
                    {metric.description}
                  </p>
                </Card>
              )}
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="lg:col-span-5" delay={120}>
          <Card className="flex flex-col h-full">
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              {t("radarTitle")}
            </h3>
            <p className="text-text-muted text-xs mb-4">
              {t("radarDescription")}
            </p>
            <div className="flex-1 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full max-w-[320px]"
                role="img"
                aria-labelledby="radar-title radar-desc"
              >
                <title id="radar-title">{t("radarImageTitle")}</title>
                <desc id="radar-desc">{radarDescription}</desc>
                {getRadarGridLevels().map((level) => (
                  <polygon
                    key={level}
                    className="radar-grid"
                    points={getRadarGridPoints(level, radarSkills.length)}
                  />
                ))}
                {radarSkills.map((_, index) => {
                  const end = getRadarAxisEnd(index, radarSkills.length);
                  return (
                    <line
                      key={`axis-${index}`}
                      className="radar-axis"
                      x1={200}
                      y1={200}
                      x2={end.x}
                      y2={end.y}
                    />
                  );
                })}
                <polygon className="radar-area" points={radarPoints} />
                {radarSkills.map((skill, index) => {
                  const label = getRadarLabelPosition(index, radarSkills.length);
                  return (
                    <text
                      key={skill.name}
                      className="radar-label"
                      x={label.x}
                      y={label.y}
                      textAnchor={label.anchor}
                    >
                      {skill.name}
                    </text>
                  );
                })}
              </svg>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {technologies.slice(0, 6).map((tech) => (
                <Badge key={tech.id}>{tech.name}</Badge>
              ))}
            </div>
          </Card>
        </RevealOnScroll>

        <div className="lg:col-span-3 space-y-4">
          <RevealOnScroll delay={160}>
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                {t("softSkillsTitle")}
              </h3>
              <ul className="space-y-3">
                {softSkills.map((skill) => (
                  <li key={skill} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-metric-teal mt-1.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-text-secondary">{skill}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </RevealOnScroll>

          {about.interests.length > 0 ? (
            <RevealOnScroll delay={240}>
              <Card>
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  {t("explorationTitle")}
                </h3>
                <ul className="space-y-2">
                  {about.interests.map((interest) => (
                    <li key={interest}>
                      <Badge>{interest}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </RevealOnScroll>
          ) : null}
        </div>
      </div>

      {stackCategories.length > 0 ? (
        <RevealOnScroll>
          <TechStackExplorer
            technologiesByCategory={technologiesByCategory}
            categories={stackCategories}
          />
        </RevealOnScroll>
      ) : null}
    </section>
  );
}
