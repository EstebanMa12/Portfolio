import { z } from "zod";
import { httpUrlSchema, optionalHttpUrlSchema } from "@/lib/schemas/common";

const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  description: z.string(),
  variant: z.enum(["highlight", "default"]),
});

export const heroContentSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string(),
  bio: z.string(),
  availability: z.object({
    label: z.string(),
    visible: z.boolean(),
  }),
  photoUrl: httpUrlSchema,
  cvUrl: z.string(),
  socialLinks: z.object({
    github: httpUrlSchema,
    linkedin: httpUrlSchema,
    email: z.string().email(),
  }),
  metrics: z.array(metricSchema),
});

export const aboutContentSchema = z.object({
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)),
  interests: z.array(z.string()),
  bioBridge: z.array(
    z.object({
      from: z.string().min(1),
      to: z.string().min(1),
    }),
  ),
  skills: z
    .array(
      z.object({
        name: z.string(),
        level: z.number(),
      }),
    )
    .optional(),
});

export const contactContentSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  email: z.string().email(),
  linkedin: httpUrlSchema,
  github: httpUrlSchema,
});

export const achievementBadgeSchema = z.enum([
  "degree",
  "aws",
  "terraform",
  "kubernetes",
  "award",
  "speaker",
  "opensource",
]);

export const achievementItemSchema = z.object({
  title: z.string().min(1),
  meta: z.string().min(1),
  badge: achievementBadgeSchema,
  url: optionalHttpUrlSchema,
});

export const achievementsContentSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  items: z.array(achievementItemSchema),
});

export const pageContentIdSchema = z.enum([
  "hero",
  "about",
  "contact",
  "achievements",
]);

export const pageContentSchemas = {
  hero: heroContentSchema,
  about: aboutContentSchema,
  contact: contactContentSchema,
  achievements: achievementsContentSchema,
} as const;

export type PageContentId = z.infer<typeof pageContentIdSchema>;
export type HeroContent = z.infer<typeof heroContentSchema>;
export type AboutContent = z.infer<typeof aboutContentSchema>;
export type ContactContent = z.infer<typeof contactContentSchema>;
export type AchievementBadge = z.infer<typeof achievementBadgeSchema>;
export type AchievementItem = z.infer<typeof achievementItemSchema>;
export type AchievementsContent = z.infer<typeof achievementsContentSchema>;

export type PageContentMap = {
  hero: HeroContent;
  about: AboutContent;
  contact: ContactContent;
  achievements: AchievementsContent;
};
