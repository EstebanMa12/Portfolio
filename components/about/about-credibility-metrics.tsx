"use client";

import { FadeInView } from "@/components/motion/fade-in-view";
import { AnimatedCounter } from "@/components/motion/animated-counter";

export type CredibilityMetric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

type AboutCredibilityMetricsProps = {
  metrics: CredibilityMetric[];
  ariaLabel: string;
};

export function AboutCredibilityMetrics({
  metrics,
  ariaLabel,
}: Readonly<AboutCredibilityMetricsProps>) {
  return (
    <FadeInView duration={0.65} className="about-credibility-metrics">
      <div
        className="about-credibility-grid"
        role="group"
        aria-label={ariaLabel}
      >
        {metrics.map((metric, index) => (
          <FadeInView
            key={metric.label}
            delay={index * 0.08}
            duration={0.5}
            className="about-credibility-item"
          >
            <p className="about-credibility-label">{metric.label}</p>
            <p className="about-credibility-value">
              <AnimatedCounter
                value={metric.value}
                suffix={metric.suffix}
                prefix={metric.prefix}
              />
            </p>
          </FadeInView>
        ))}
      </div>
    </FadeInView>
  );
}
