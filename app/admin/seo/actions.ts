"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { seoSettingsSchema } from "@/lib/schemas/seo-settings";
import { localeSchema } from "@/lib/schemas/locale";
import * as seoRepo from "@/lib/repositories/seo-repo";
import { revalidateEntity } from "@/lib/revalidate";

export type ActionState = {
  error?: string;
  success?: string;
};

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

export async function updateSeoSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const locale = localeSchema.parse(String(formData.get("locale") ?? "es"));
    const input = seoSettingsSchema.parse({
      siteName: String(formData.get("siteName") ?? ""),
      titleTemplate: String(formData.get("titleTemplate") ?? ""),
      defaultDescription: String(formData.get("defaultDescription") ?? ""),
      siteUrl: String(formData.get("siteUrl") ?? ""),
      defaultOgImage: emptyToNull(formData.get("defaultOgImage")),
      twitterHandle: emptyToNull(formData.get("twitterHandle")),
    });

    await seoRepo.updateSettings(input, locale);
    await revalidateEntity("seo");
    revalidatePath("/admin/seo");
    return { success: "SEO global guardado." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error ? error.message : "No se pudo guardar la configuración SEO.",
    };
  }
}
