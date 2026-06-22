"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { ensureUniqueSlug } from "@/lib/domain/content/content-service";
import { technologyInsertSchema } from "@/lib/schemas/technology";
import * as technologyRepo from "@/lib/repositories/technology-repo";
import { revalidateEntity } from "@/lib/revalidate";

const technologyFormSchema = technologyInsertSchema.extend({
  iconUrl: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .pipe(z.string().url().nullable()),
});

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function parseTechnologyForm(formData: FormData) {
  return technologyFormSchema.parse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    category: String(formData.get("category") ?? ""),
    iconUrl: emptyToNull(formData.get("iconUrl")),
  });
}

export type ActionState = {
  error?: string;
  success?: string;
};

async function revalidateTechnologies() {
  await Promise.all([
    revalidateEntity("home"),
    revalidateEntity("experience"),
    revalidateEntity("projects"),
  ]);
}

export async function createTechnology(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const input = parseTechnologyForm(formData);

    const slugTaken = await technologyRepo.slugExists(input.slug);
    if (slugTaken) {
      return { error: "El slug ya existe." };
    }

    await technologyRepo.create(input);
    await revalidateTechnologies();
    revalidatePath("/admin/technologies");
    return { success: "Tecnología creada." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo crear la tecnología.",
    };
  }
}

export async function updateTechnology(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const input = parseTechnologyForm(formData);

    const slugTaken = await technologyRepo.slugExists(input.slug, id);
    if (slugTaken) {
      return { error: "El slug ya existe." };
    }

    await technologyRepo.update(id, input);
    await revalidateTechnologies();
    revalidatePath("/admin/technologies");
    return { success: "Tecnología actualizada." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la tecnología.",
    };
  }
}

export async function deleteTechnology(id: string): Promise<ActionState> {
  await requireAdmin();

  try {
    await technologyRepo.remove(id);
    await revalidateTechnologies();
    revalidatePath("/admin/technologies");
    return { success: "Tecnología eliminada." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo eliminar. Puede estar en uso.",
    };
  }
}

export async function suggestTechnologySlug(name: string) {
  await requireAdmin();
  return ensureUniqueSlug(name, "technology");
}
