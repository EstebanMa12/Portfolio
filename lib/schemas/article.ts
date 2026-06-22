import { z } from "zod";
import { contentStatusSchema } from "./common";
import { localeSchema } from "./locale";

export const articleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  locale: localeSchema,
  excerpt: z.string().min(160).max(320),
  content: z.string().min(1),
  tags: z.array(z.string()),
  coverImageUrl: z.string().url().nullable(),
  status: contentStatusSchema,
  publishedAt: z.string().nullable(),
  readingTimeMin: z.number().int().nullable(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoOgImage: z.string().url().nullable(),
  seoCanonical: z.string().url().nullable(),
  seoNoindex: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const articleInsertSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  locale: localeSchema.default("es"),
  excerpt: z.string().min(160).max(320),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
  coverImageUrl: z.string().url().nullable().optional(),
  status: contentStatusSchema.default("draft"),
});

export type Article = z.infer<typeof articleSchema>;
export type ArticleInsert = z.infer<typeof articleInsertSchema>;
