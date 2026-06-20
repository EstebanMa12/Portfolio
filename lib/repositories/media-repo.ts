import { unwrap } from "@/lib/repositories/base";
import { mapMediaAsset } from "@/lib/repositories/mappers";
import { createClient } from "@/lib/supabase/server";
import type { MediaAsset } from "@/lib/schemas/media";
import { mediaAssetSchema } from "@/lib/schemas/media";

export async function create(input: {
  filename: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string | null;
}): Promise<MediaAsset> {
  const supabase = await createClient();
  const row = unwrap(
    await supabase
      .from("media_assets")
      .insert({
        filename: input.filename,
        storage_path: input.storagePath,
        mime_type: input.mimeType,
        size_bytes: input.sizeBytes,
        alt_text: input.altText ?? null,
      })
      .select("*")
      .single(),
  );

  return mediaAssetSchema.parse(mapMediaAsset(row));
}

export async function getById(id: string): Promise<MediaAsset | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;
  return mediaAssetSchema.parse(mapMediaAsset(data));
}

export async function listAll(): Promise<MediaAsset[]> {
  const supabase = await createClient();
  const rows = unwrap(
    await supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false }),
  );

  return rows.map((row) => mediaAssetSchema.parse(mapMediaAsset(row)));
}
