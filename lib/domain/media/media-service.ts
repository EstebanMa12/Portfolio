import * as mediaRepo from "@/lib/repositories/media-repo";
import { createClient } from "@/lib/supabase/server";

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const PDF_MIME_TYPE = "application/pdf";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

export class MediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaValidationError";
  }
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function getPublicUrl(bucket: "media" | "cv", storagePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }

  return `${baseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
}

async function uploadToBucket(
  bucket: "media" | "cv",
  file: File,
  allowedMimeTypes: Set<string>,
  maxBytes: number,
  altText?: string,
) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new MediaValidationError(`Unsupported file type: ${file.type}`);
  }

  if (file.size > maxBytes) {
    throw new MediaValidationError(
      `File exceeds maximum size of ${Math.floor(maxBytes / (1024 * 1024))}MB`,
    );
  }

  const storagePath = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const asset = await mediaRepo.create({
    filename: file.name,
    storagePath,
    mimeType: file.type,
    sizeBytes: file.size,
    altText,
  });

  return {
    asset,
    publicUrl: getPublicUrl(bucket, storagePath),
    storagePath,
  };
}

export async function uploadImage(file: File, altText?: string) {
  return uploadToBucket(
    "media",
    file,
    IMAGE_MIME_TYPES,
    MAX_IMAGE_BYTES,
    altText,
  );
}

export async function uploadPdf(file: File, altText?: string) {
  return uploadToBucket(
    "cv",
    file,
    new Set([PDF_MIME_TYPE]),
    MAX_PDF_BYTES,
    altText,
  );
}
