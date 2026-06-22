"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

type LocaleSwitcherProps = {
  className?: string;
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations("locale");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const targetLocale: Locale = locale === "es" ? "en" : "es";
  const label = targetLocale === "en" ? t("switchToEn") : t("switchToEs");

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      className={cn(
        "locale-switch text-sm font-medium text-text-secondary hover:text-text-primary transition-colors",
        className,
      )}
      aria-label={`${t("label")}: ${label}`}
      hrefLang={targetLocale}
    >
      {label}
    </Link>
  );
}
