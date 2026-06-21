import { z } from "zod";
import { contentStatusSchema } from "./common";
import { localeSchema } from "./locale";
import { technologySchema } from "./technology";

export const projectImageSchema = z.object({
  id: z.string().uuid(),
  imageUrl: z.string().url(),
  altText: z.string(),
  sortOrder: z.number().int(),
});

export const projectImageInputSchema = z.object({
  imageUrl: z.string().url(),
  altText: z.string().default(""),
  sortOrder: z.number().int().default(0),
});

export const projectSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  locale: localeSchema,
  category: z.string().min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  result: z.string().min(1),
  content: z.string().nullable(),
  githubUrl: z.string().url().nullable(),
  demoUrl: z.string().url().nullable(),
  coverImageUrl: z.string().url().nullable(),
  featured: z.boolean(),
  status: contentStatusSchema,
  sortOrder: z.number().int(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  seoOgImage: z.string().url().nullable(),
  seoCanonical: z.string().url().nullable(),
  seoNoindex: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const projectWithTechnologiesSchema = projectSchema.extend({
  technologies: z.array(technologySchema).default([]),
  images: z.array(projectImageSchema).default([]),
});

export const projectInsertSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  locale: localeSchema.default("es"),
  category: z.string().min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  result: z.string().min(1),
  content: z.string().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  demoUrl: z.string().url().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  featured: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  sortOrder: z.number().int().default(0),
  technologyIds: z.array(z.string().uuid()).default([]),
  images: z.array(projectImageInputSchema).default([]),
});

export type ProjectImage = z.infer<typeof projectImageSchema>;
export type ProjectImageInput = z.infer<typeof projectImageInputSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectWithTechnologies = z.infer<
  typeof projectWithTechnologiesSchema
>;
export type ProjectInsert = z.infer<typeof projectInsertSchema>;
