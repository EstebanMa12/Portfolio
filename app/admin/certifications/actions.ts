"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  MediaValidationError,
  uploadImage,
  uploadPdf,
} from "@/lib/domain/media/media-service";
import {
  achievementItemSchema,
  achievementsContentSchema,
} from "@/lib/schemas/page-content";
import { localeSchema } from "@/lib/schemas/locale";
import * as pageContentRepo from "@/lib/repositories/page-content-repo";
import { revalidateEntity } from "@/lib/revalidate";

export type ActionState = {
  error?: string;
  success?: string;
};

function emptyToNull(value: FormDataEntryValue | null): string | undefined {
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  return trimmed === "" ? undefined : trimmed;
}

function parseItems(formData: FormData) {
  const titles = formData.getAll("itemTitle").map(String);
  const metas = formData.getAll("itemMeta").map(String);
  const badges = formData.getAll("itemBadge").map(String);
  const urls = formData.getAll("itemUrl").map(String);
  const imageUrls = formData.getAll("itemImageUrl").map(String);

  return titles
    .map((title, index) =>
      achievementItemSchema.parse({
        title: title.trim(),
        meta: metas[index]?.trim() ?? "",
        badge: badges[index],
        url: emptyToNull(urls[index] ?? null),
        imageUrl: emptyToNull(imageUrls[index] ?? null),
      }),
    )
    .filter((item) => item.title && item.meta);
}

export async function uploadCertificationAsset(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { url?: string; kind?: "image" | "pdf" }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo." };
  }

  const altText = String(formData.get("altText") ?? "");

  try {
    if (file.type === "application/pdf") {
      const { publicUrl } = await uploadPdf(file, altText);
      return { success: "Diploma subido.", url: publicUrl, kind: "pdf" };
    }

    const { publicUrl } = await uploadImage(file, altText);
    return { success: "Imagen subida.", url: publicUrl, kind: "image" };
  } catch (error) {
    if (error instanceof MediaValidationError) {
      return { error: error.message };
    }
    return {
      error:
        error instanceof Error ? error.message : "Error al subir el archivo.",
    };
  }
}

export async function updateCertificationsContent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const locale = localeSchema.parse(String(formData.get("locale") ?? "es"));
    const input = achievementsContentSchema.parse({
      label: String(formData.get("label") ?? ""),
      title: String(formData.get("title") ?? ""),
      items: parseItems(formData),
    });

    await pageContentRepo.updateById("achievements", input, locale);
    await revalidateEntity("page-content");
    revalidatePath("/admin/certifications");
    return { success: "Certificaciones guardadas." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudieron guardar las certificaciones.",
    };
  }
}
