"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { experienceInsertSchema } from "@/lib/schemas/experience";
import * as experienceRepo from "@/lib/repositories/experience-repo";
import { revalidateEntity } from "@/lib/revalidate";

const experienceFormSchema = experienceInsertSchema.extend({
  endDate: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .optional(),
});

function parseExperienceForm(formData: FormData) {
  const bullets = formData
    .getAll("bullets")
    .map(String)
    .map((bullet) => bullet.trim())
    .filter(Boolean);

  const technologyIds = formData.getAll("technologyIds").map(String);
  const startDate = normalizeMonthDate(String(formData.get("startDate") ?? ""));
  const endDateRaw = String(formData.get("endDate") ?? "").trim();
  const endDate = endDateRaw ? normalizeMonthDate(endDateRaw) : null;

  return experienceFormSchema.parse({
    company: String(formData.get("company") ?? ""),
    role: String(formData.get("role") ?? ""),
    startDate,
    endDate,
    bullets,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    technologyIds,
  });
}

function normalizeMonthDate(value: string): string {
  if (/^\d{4}-\d{2}$/.test(value)) {
    return `${value}-01`;
  }
  return value;
}

export type ActionState = {
  error?: string;
  success?: string;
};

export async function createExperience(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  let createdId: string;

  try {
    const input = parseExperienceForm(formData);
    const experience = await experienceRepo.create(input);
    await revalidateEntity("experience");
    createdId = experience.id;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo crear la experiencia.",
    };
  }

  redirect(`/admin/experience/${createdId}?created=1`);
}

export async function updateExperience(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const input = parseExperienceForm(formData);
    await experienceRepo.update(id, input);
    await revalidateEntity("experience");
    revalidatePath(`/admin/experience/${id}`);
    return { success: "Experiencia guardada." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la experiencia.",
    };
  }
}

export async function deleteExperience(id: string): Promise<void> {
  await requireAdmin();
  await experienceRepo.remove(id);
  await revalidateEntity("experience");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}
