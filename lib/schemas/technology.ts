import { z } from "zod";
import { techCategorySchema } from "./common";

export const technologySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: techCategorySchema,
  iconUrl: z.string().url().nullable(),
  createdAt: z.string(),
});

export const technologyInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: techCategorySchema,
  iconUrl: z.string().url().nullable().optional(),
});

export type Technology = z.infer<typeof technologySchema>;
export type TechnologyInsert = z.infer<typeof technologyInsertSchema>;
