import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

function collectKeys(
  value: unknown,
  prefix = "",
): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, nested]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        return collectKeys(nested, path);
      }
      return [path];
    },
  );
}

describe("i18n key parity", () => {
  it("keeps es.json and en.json in sync", () => {
    const esKeys = new Set(collectKeys(es));
    const enKeys = new Set(collectKeys(en));

    const missingInEn = [...esKeys].filter((key) => !enKeys.has(key));
    const missingInEs = [...enKeys].filter((key) => !esKeys.has(key));

    expect(missingInEn).toEqual([]);
    expect(missingInEs).toEqual([]);
  });
});
