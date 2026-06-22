"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function AboutPageAmbience() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const orbY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -40]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.65, 0.4]);

  return (
    <div ref={ref} aria-hidden className="about-page-ambience pointer-events-none">
      <motion.div
        className="about-page-orb about-page-orb--teal"
        style={{ y: orbY }}
      />
      <motion.div
        className="about-page-orb about-page-orb--accent"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 30]) }}
      />
      <motion.div
        className="about-page-grid"
        style={{ opacity: gridOpacity }}
      />
      <div className="about-page-noise" />
    </div>
  );
}
