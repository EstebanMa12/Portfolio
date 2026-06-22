import type { Locale } from "./config";
import { defaultLocale, isLocale } from "./config";

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return normalized === "/" ? "/" : normalized;
  }
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

export function stripLocaleFromPathname(pathname: string): {
  locale: Locale | null;
  pathname: string;
} {
  const normalized = pathname || "/";
  const segments = normalized.split("/");
  const maybeLocale = segments[1];

  if (
    maybeLocale &&
    isLocale(maybeLocale) &&
    maybeLocale !== defaultLocale
  ) {
    const rest = segments.slice(2).join("/");
    return { locale: maybeLocale, pathname: rest ? `/${rest}` : "/" };
  }

  return { locale: null, pathname: normalized };
}
