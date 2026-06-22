"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  aboutContentSchema,
  contactContentSchema,
  heroContentSchema,
} from "@/lib/schemas/page-content";
import { localeSchema } from "@/lib/schemas/locale";
import * as pageContentRepo from "@/lib/repositories/page-content-repo";
import { revalidateEntity } from "@/lib/revalidate";

export type ActionState = {
  error?: string;
  success?: string;
};

function parseLocale(formData: FormData) {
  return localeSchema.parse(String(formData.get("locale") ?? "es"));
}

function parseMetrics(formData: FormData) {
  const titles = formData.getAll("metricLabel").map(String);
  const values = formData.getAll("metricValue").map(String);
  const descriptions = formData.getAll("metricDescription").map(String);
  const variants = formData.getAll("metricVariant").map(String);

  return titles
    .map((label, index) => ({
      label: label.trim(),
      value: values[index]?.trim() ?? "",
      description: descriptions[index]?.trim() ?? "",
      variant: z.enum(["highlight", "default"]).parse(variants[index] ?? "default"),
    }))
    .filter((metric) => metric.label && metric.value);
}

function parseParagraphs(formData: FormData) {
  return formData
    .getAll("paragraphs")
    .map(String)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function parseBioBridge(formData: FormData) {
  const fromValues = formData.getAll("bioBridgeFrom").map(String);
  const toValues = formData.getAll("bioBridgeTo").map(String);

  return fromValues
    .map((from, index) => ({
      from: from.trim(),
      to: toValues[index]?.trim() ?? "",
    }))
    .filter((row) => row.from && row.to);
}

function parseInterests(raw: FormDataEntryValue | null) {
  if (raw == null) return [];
  return String(raw)
    .split(",")
    .map((interest) => interest.trim())
    .filter(Boolean);
}

async function revalidatePageContent(locale: string) {
  await revalidateEntity("page-content");
  revalidatePath(`/admin/pages/hero`);
  revalidatePath(`/admin/pages/about`);
  revalidatePath(`/admin/pages/contact`);
  void locale;
}

export async function updateHeroContent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const locale = parseLocale(formData);
    const input = heroContentSchema.parse({
      name: String(formData.get("name") ?? ""),
      headline: String(formData.get("headline") ?? ""),
      subheadline: String(formData.get("subheadline") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      availability: {
        label: String(formData.get("availabilityLabel") ?? ""),
        visible: formData.get("availabilityVisible") === "on",
      },
      photoUrl: String(formData.get("photoUrl") ?? ""),
      cvUrl: String(formData.get("cvUrl") ?? ""),
      socialLinks: {
        github: String(formData.get("github") ?? ""),
        linkedin: String(formData.get("linkedin") ?? ""),
        email: String(formData.get("email") ?? ""),
      },
      metrics: parseMetrics(formData),
    });

    await pageContentRepo.updateById("hero", input, locale);
    await revalidatePageContent(locale);
    return { success: "Hero guardado." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error: error instanceof Error ? error.message : "No se pudo guardar el hero.",
    };
  }
}

export async function updateAboutContent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const locale = parseLocale(formData);
    const existing = await pageContentRepo.getByIdAdmin("about", locale);
    const input = aboutContentSchema.parse({
      title: String(formData.get("title") ?? ""),
      paragraphs: parseParagraphs(formData),
      interests: parseInterests(formData.get("interests")),
      bioBridge: parseBioBridge(formData),
      ...(existing?.skills ? { skills: existing.skills } : {}),
    });

    await pageContentRepo.updateById("about", input, locale);
    await revalidatePageContent(locale);
    return { success: "About guardado." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error: error instanceof Error ? error.message : "No se pudo guardar about.",
    };
  }
}

export async function updateContactContent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const locale = parseLocale(formData);
    const input = contactContentSchema.parse({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      email: String(formData.get("email") ?? ""),
      linkedin: String(formData.get("linkedin") ?? ""),
      github: String(formData.get("github") ?? ""),
    });

    await pageContentRepo.updateById("contact", input, locale);
    await revalidatePageContent(locale);
    return { success: "Contact guardado." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error ? error.message : "No se pudo guardar contact.",
    };
  }
}
