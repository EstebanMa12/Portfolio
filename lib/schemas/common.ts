import { z } from "zod";
import { normalizeHttpUrl } from "@/lib/utils/normalize-url";

export const httpUrlSchema = z.preprocess(
  (value) => (typeof value === "string" ? normalizeHttpUrl(value) : value),
  z.string().url(),
);

export const optionalHttpUrlSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() !== ""
      ? normalizeHttpUrl(value)
      : value,
  z.string().url().optional(),
);

export const contentStatusSchema = z.enum(["draft", "published"]);

export const techCategorySchema = z.enum([
  "language",
  "framework",
  "infra",
  "database",
  "tool",
]);

export const seoFieldsSchema = z.object({
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  seoOgImage: z.string().url().nullable().optional(),
  seoCanonical: z.string().url().nullable().optional(),
  seoNoindex: z.boolean().optional(),
});

export type ContentStatus = z.infer<typeof contentStatusSchema>;
export type TechCategory = z.infer<typeof techCategorySchema>;
