"use client";

import { motion } from "framer-motion";
import { FadeInView } from "@/components/motion/fade-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type AboutEvolutionPathProps = {
  label: string;
  fromLabel: string;
  toLabel: string;
  fromDetail: string;
  toDetail: string;
};

export function AboutEvolutionPath({
  label,
  fromLabel,
  toLabel,
  fromDetail,
  toDetail,
}: Readonly<AboutEvolutionPathProps>) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <FadeInView delay={0.15} duration={0.7} className="about-evolution-path">
      <p className="section-label mb-5">{label}</p>

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-center">
        <EvolutionNode
          label={fromLabel}
          detail={fromDetail}
          variant="science"
          delay={0.2}
        />

        <div
          className="about-evolution-connector hidden md:flex flex-col items-center justify-center px-2"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 120 24"
            className="w-28 h-6 text-accent"
            fill="none"
          >
            <motion.path
              d="M0 12 H96"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.35"
              initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M96 12 L108 6 M96 12 L108 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 1 }}
            />
            <motion.circle
              cx="48"
              cy="12"
              r="3"
              fill="currentColor"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.65 }}
            />
          </svg>
        </div>

        <div className="md:hidden flex justify-center py-1" aria-hidden="true">
          <motion.div
            className="about-evolution-mobile-arrow"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </div>

        <EvolutionNode
          label={toLabel}
          detail={toDetail}
          variant="software"
          delay={0.55}
        />
      </div>
    </FadeInView>
  );
}

function EvolutionNode({
  label,
  detail,
  variant,
  delay,
}: {
  label: string;
  detail: string;
  variant: "science" | "software";
  delay: number;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.article
      className={`about-evolution-node about-evolution-node--${variant}`}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="about-evolution-node-icon" aria-hidden="true">
        {variant === "science" ? (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path
              d="M10 2v7.5L4 20a1 1 0 0 0 .87 1.5h14.26a1 1 0 0 0 .87-1.5L14 9.5V2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 2h7M12 9.5v3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <rect
              x="3"
              y="4"
              width="18"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 20h8M9 18h6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M7.5 9h3M7.5 12.5h5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <h2 className="font-display text-lg font-semibold text-text-primary tracking-tight">
        {label}
      </h2>
      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
        {detail}
      </p>
    </motion.article>
  );
}
