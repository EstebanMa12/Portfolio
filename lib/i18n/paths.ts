import type { Locale } from "./config";
import { defaultLocale } from "./config";

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
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (maybeLocale === "en") {
    const rest = segments.slice(2).join("/");
    return { locale: "en", pathname: rest ? `/${rest}` : "/" };
  }
  return { locale: null, pathname };
}
