"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();
  const t = useTranslations("theme");

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn("theme-toggle", className)}
        aria-label={t("toggle")}
        disabled
      >
        <span className="w-5 h-5" aria-hidden="true" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  function cycleTheme() {
    if (theme === "system") {
      setTheme(isDark ? "light" : "dark");
      return;
    }
    if (theme === "dark") {
      setTheme("light");
      return;
    }
    if (theme === "light") {
      setTheme("system");
      return;
    }
    setTheme("system");
  }

  const label =
    theme === "system" ? t("system") : theme === "dark" ? t("dark") : t("light");

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn("theme-toggle", className)}
      aria-label={label}
      title={label}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m0-13.656 1.414 1.414M16.95 16.95l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
}
