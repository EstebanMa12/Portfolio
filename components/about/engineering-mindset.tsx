"use client";

import { motion } from "framer-motion";
import { FadeInView } from "@/components/motion/fade-in-view";
import { SectionLabel } from "@/components/public/section-label";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export type MindsetItem = {
  title: string;
  bioContext: string;
  softwareContext: string;
};

type EngineeringMindsetProps = {
  label: string;
  title: string;
  description: string;
  items: MindsetItem[];
  bioLabel: string;
  softwareLabel: string;
};

const mindsetIcons = [
  (
    <svg key="system" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  (
    <svg key="model" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path
        d="M4 18V6l8-3 8 3v12l-8 3-8-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 3v18M4 6l8 3 8-3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  (
    <svg key="validate" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path
        d="M9 12l2 2 4-4M6 20h12a2 2 0 0 0 2-2V8l-6-4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  (
    <svg key="evidence" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path
        d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
];

export function EngineeringMindset({
  label,
  title,
  description,
  items,
  bioLabel,
  softwareLabel,
}: Readonly<EngineeringMindsetProps>) {
  return (
    <section aria-labelledby="mindset-heading" className="about-mindset-section">
      <FadeInView duration={0.6}>
        <SectionLabel className="mb-3">{label}</SectionLabel>
        <h2
          id="mindset-heading"
          className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-4"
        >
          {title}
        </h2>
        <p className="text-text-secondary text-base leading-relaxed max-w-prose mb-10">
          {description}
        </p>
      </FadeInView>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {items.map((item, index) => (
          <MindsetCard
            key={item.title}
            item={item}
            index={index}
            icon={mindsetIcons[index % mindsetIcons.length]}
            bioLabel={bioLabel}
            softwareLabel={softwareLabel}
          />
        ))}
      </div>
    </section>
  );
}

function MindsetCard({
  item,
  index,
  icon,
  bioLabel,
  softwareLabel,
}: {
  item: MindsetItem;
  index: number;
  icon: React.ReactNode;
  bioLabel: string;
  softwareLabel: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.article
      className="about-mindset-card card group"
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reducedMotion ? undefined : { y: -2 }}
    >
      <div className="about-mindset-card-glow" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-start gap-3 mb-4">
          <div className="about-mindset-icon">{icon}</div>
          <h3 className="font-display text-base font-semibold text-text-primary tracking-tight pt-0.5">
            {item.title}
          </h3>
        </div>

        <div className="space-y-3">
          <MindsetContext label={bioLabel} text={item.bioContext} variant="science" />
          <div className="about-mindset-divider" aria-hidden="true" />
          <MindsetContext label={softwareLabel} text={item.softwareContext} variant="software" />
        </div>
      </div>
    </motion.article>
  );
}

function MindsetContext({
  label,
  text,
  variant,
}: {
  label: string;
  text: string;
  variant: "science" | "software";
}) {
  return (
    <div>
      <p
        className={`about-mindset-context-label about-mindset-context-label--${variant}`}
      >
        {label}
      </p>
      <p className="text-sm text-text-secondary leading-relaxed mt-1">{text}</p>
    </div>
  );
}
