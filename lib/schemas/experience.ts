import { z } from "zod";
import { technologySchema } from "./technology";

export const experienceSchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().nullable(),
  bullets: z.array(z.string()),
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const experienceWithTechnologiesSchema = experienceSchema.extend({
  technologies: z.array(technologySchema),
});

export const experienceInsertSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  bullets: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
  technologyIds: z.array(z.string().uuid()).default([]),
});

export type Experience = z.infer<typeof experienceSchema>;
export type ExperienceWithTechnologies = z.infer<
  typeof experienceWithTechnologiesSchema
>;
export type ExperienceInsert = z.infer<typeof experienceInsertSchema>;
