import { getTranslations } from "next-intl/server";
import { Card } from "@/components/public/card";
import { MetricHighlight } from "@/components/public/metric-highlight";
import type { HeroContent } from "@/lib/schemas/page-content";

type ImpactMetricsProps = {
  metrics: HeroContent["metrics"];
};

export async function ImpactMetrics({ metrics }: Readonly<ImpactMetricsProps>) {
  const t = await getTranslations("a11y");

  if (metrics.length === 0) return null;

  const [highlight, ...rest] = metrics;

  return (
    <div
      className="space-y-3 pt-2"
      role="group"
      aria-label={t("impactMetrics")}
    >
      {highlight ? (
        <MetricHighlight
          label={highlight.label}
          value={highlight.value}
          detail={highlight.description}
        />
      ) : null}

      {rest.length > 0 ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rest.map((metric) => (
            <Card key={metric.label} as="div" className="py-4 px-5">
              <dt className="text-text-muted text-xs font-medium uppercase tracking-wide">
                {metric.label}
              </dt>
              <dd className="metric-value mt-1 font-display text-2xl font-semibold text-metric-teal">
                {metric.value}
              </dd>
              {metric.description ? (
                <dd className="text-text-secondary text-xs mt-1">
                  {metric.description}
                </dd>
              ) : null}
            </Card>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
