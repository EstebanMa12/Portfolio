import { z } from "zod";

export const seoSettingsSchema = z.object({
  siteName: z.string().min(1),
  titleTemplate: z.string().min(1),
  defaultDescription: z.string().min(1),
  siteUrl: z.string().url(),
  defaultOgImage: z.string().url().nullable(),
  twitterHandle: z.string().nullable(),
});

export type SeoSettingsValidated = z.infer<typeof seoSettingsSchema>;
