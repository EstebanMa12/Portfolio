import { z } from "zod";

export const mediaAssetSchema = z.object({
  id: z.string().uuid(),
  filename: z.string().min(1),
  storagePath: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  altText: z.string().nullable(),
  createdAt: z.string(),
});

export type MediaAsset = z.infer<typeof mediaAssetSchema>;
