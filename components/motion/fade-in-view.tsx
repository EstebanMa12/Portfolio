"use client";

import {
  motion,
  type Variants,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils/cn";

export type FadeDirection = "up" | "down" | "left" | "right" | "none";

const directionOffset: Record<FadeDirection, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

type FadeInViewProps = {
  children: React.ReactNode;
  className?: string;
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
};

export function FadeInView({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  amount = 0.15,
  once = true,
}: FadeInViewProps) {
  const reducedMotion = usePrefersReducedMotion();
  const offset = directionOffset[direction];

  if (reducedMotion) {
    return (
      <div className={className}>{children}</div>
    );
  }

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
};

export function StaggerContainer({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
  amount = 0.12,
}: StaggerContainerProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: FadeDirection;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const offset = directionOffset[direction];

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: offset.y, x: offset.x },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
