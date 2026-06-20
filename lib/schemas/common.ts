import { z } from "zod";

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
