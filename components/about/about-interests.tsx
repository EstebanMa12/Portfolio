"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeInView } from "@/components/motion/fade-in-view";
import { cn } from "@/lib/utils/cn";

type InterestItem = {
  name: string;
  description: string;
  relatedHref?: string;
  relatedLabel?: string;
};

type AboutInterestsProps = {
  title: string;
  interests: InterestItem[];
};

const interestIcons: Record<string, React.ReactNode> = {
  ai: (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  quantum: (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(120 12 12)"
      />
    </svg>
  ),
  neuroscience: (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <path
        d="M8 5c-2 1-3 3.5-3 6.5 0 4 2.5 7 6 7.5M16 5c2 1 3 3.5 3 6.5 0 4-2.5 7-6 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 4v16M9 9h6M9 14h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  fitness: (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <path
        d="M6 12h12M4 10v4M20 10v4M8 8v8M16 8v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <path
        d="M12 6l1.5 4.5L18 12l-4.5 1.5L12 18l-1.5-4.5L6 12l4.5-1.5L12 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function getInterestIcon(name: string): React.ReactNode {
  const normalized = name.toLowerCase();
  if (
    normalized.includes("inteligencia") ||
    normalized.includes("artificial") ||
    normalized.includes("intelligence")
  ) {
    return interestIcons.ai;
  }
  if (normalized.includes("cuántic") || normalized.includes("quantum")) {
    return interestIcons.quantum;
  }
  if (
    normalized.includes("neuro") ||
    normalized.includes("computational")
  ) {
    return interestIcons.neuroscience;
  }
  if (normalized.includes("fitness") || normalized.includes("salud")) {
    return interestIcons.fitness;
  }
  return interestIcons.default;
}

export function AboutInterests({
  title,
  interests,
}: Readonly<AboutInterestsProps>) {
  if (interests.length === 0) return null;

  return (
    <FadeInView delay={0.2} duration={0.6}>
      <h2 className="text-sm font-semibold text-text-primary mb-4">{title}</h2>
      <ul className="flex flex-col gap-2.5" role="list">
        {interests.map((interest, index) => (
          <InterestChip key={interest.name} interest={interest} index={index} />
        ))}
      </ul>
    </FadeInView>
  );
}

function InterestChip({
  interest,
  index,
}: {
  interest: InterestItem;
  index: number;
}) {
  const [focused, setFocused] = useState(false);
  const tooltipId = useId();
  const showTooltip = focused;

  return (
    <li>
      <motion.div
        className="about-interest-chip group"
        tabIndex={0}
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.5,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
      >
        <span className="about-interest-icon" aria-hidden="true">
          {getInterestIcon(interest.name)}
        </span>
        <span className="about-interest-name">{interest.name}</span>

        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "about-interest-tooltip",
            showTooltip && "is-visible",
          )}
        >
          <span className="block text-text-primary text-xs font-medium leading-snug">
            {interest.description}
          </span>
          {interest.relatedHref && interest.relatedLabel ? (
            <Link
              href={interest.relatedHref}
              className="mt-2 inline-flex text-[11px] font-semibold text-accent hover:text-text-primary transition-colors"
            >
              {interest.relatedLabel} →
            </Link>
          ) : null}
        </span>
      </motion.div>
    </li>
  );
}
