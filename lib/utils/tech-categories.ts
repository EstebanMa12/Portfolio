import type { TechCategory } from "@/lib/schemas/common";
import type { Technology } from "@/lib/schemas/technology";

export const TECH_CATEGORY_LABELS: Record<TechCategory, string> = {
  language: "Lenguaje",
  framework: "Framework",
  database: "Base de datos",
  infra: "Infraestructura",
  tool: "Herramienta",
};

export const TECH_CATEGORY_ORDER: TechCategory[] = [
  "language",
  "framework",
  "database",
  "infra",
  "tool",
];

export function getOrderedStackCategories(
  technologiesByCategory: Partial<Record<TechCategory, Technology[]>>,
): TechCategory[] {
  return TECH_CATEGORY_ORDER.filter(
    (category) => (technologiesByCategory[category]?.length ?? 0) > 0,
  );
}
