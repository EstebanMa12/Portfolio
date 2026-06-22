import type { Locale } from "@/lib/i18n/config";

/** Stable i18n keys for interestDescriptions (parity across locales). */
export const INTEREST_SLUG_BY_NAME: Record<Locale, Record<string, string>> = {
  es: {
    "Inteligencia Artificial": "ai",
    "Computación Cuántica": "quantum",
    "Neurociencia Computacional": "neuro",
    Fitness: "fitness",
  },
  en: {
    "Artificial Intelligence": "ai",
    "Quantum Computing": "quantum",
    "Computational Neuroscience": "neuro",
    Fitness: "fitness",
  },
};

export function getInterestDescriptionKey(name: string, locale: Locale): string {
  return INTEREST_SLUG_BY_NAME[locale][name] ?? name;
}
