"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils/cn";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.2,
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const spring = useSpring(reducedMotion ? value : 0, {
    duration: duration * 1000,
    bounce: 0,
  });
  const display = useTransform(spring, (current) => {
    const formatted =
      decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
    return `${prefix}${formatted}${suffix}`;
  });
  const [text, setText] = useState(
    `${prefix}${reducedMotion ? value : 0}${suffix}`,
  );

  useEffect(() => {
    if (reducedMotion) return;
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    return display.on("change", (latest) => setText(latest));
  }, [display, reducedMotion]);

  return (
    <motion.span
      ref={ref}
      className={cn("metric-value tabular-nums", className)}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {text}
    </motion.span>
  );
}
