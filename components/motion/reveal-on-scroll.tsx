"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils/cn";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

const directionClass: Record<RevealDirection, string> = {
  up: "reveal-from-up",
  down: "reveal-from-down",
  left: "reveal-from-left",
  right: "reveal-from-right",
  none: "reveal-from-none",
};

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  once?: boolean;
  amount?: number;
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  amount = 0.12,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        threshold: amount,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, once, amount]);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-on-scroll",
        directionClass[direction],
        (visible || reducedMotion) && "is-visible",
        className,
      )}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
