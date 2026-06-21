"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils/cn";

type ScrollHeaderProps = {
  children: ReactNode;
};

export function ScrollHeader({ children }: ScrollHeaderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <header
      className={cn(
        "site-header fixed top-0 w-full z-50 border-b border-border transition-[background-color,box-shadow,border-color] duration-300",
        scrolled ? "site-header-scrolled" : "site-header-top",
      )}
    >
      {children}
    </header>
  );
}
