"use client";

import type { ReactNode } from "react";
import {
  FadeInView,
  MOTION_DURATION,
  type FadeDirection,
} from "@/components/motion/fade-in-view";

export type RevealDirection = FadeDirection;

/** Default scroll-reveal timing — aligned with About page (`FadeInView`). */
export const REVEAL_DURATION = MOTION_DURATION;
export const REVEAL_STAGGER_MS = 80;

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** Delay in milliseconds (80 ≈ About stagger step). */
  delay?: number;
  direction?: RevealDirection;
  once?: boolean;
  amount?: number;
  duration?: number;
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  amount = 0.15,
  duration = REVEAL_DURATION,
}: RevealOnScrollProps) {
  return (
    <FadeInView
      className={className}
      direction={direction}
      delay={delay / 1000}
      duration={duration}
      amount={amount}
      once={once}
    >
      {children}
    </FadeInView>
  );
}
