"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { publishProject as publishProjectService } from "@/lib/domain/content/content-service";
import { uploadImage, MediaValidationError } from "@/lib/domain/media/media-service";
import { projectInsertSchema } from "@/lib/schemas/project";
import { seoFieldsSchema } from "@/lib/schemas/common";
import { localeSchema } from "@/lib/schemas/locale";
import * as projectRepo from "@/lib/repositories/project-repo";
import { revalidateEntity } from "@/lib/revalidate";
import { generateSlug } from "@/lib/domain/content/content-service";

const projectImageInputSchema = z.object({
  imageUrl: z.string().url(),
  altText: z.string().default(""),
  sortOrder: z.number().int(),
});

const projectFormSchema = projectInsertSchema
  .omit({ technologyIds: true, images: true })
  .merge(seoFieldsSchema)
  .extend({
    technologyIds: z.array(z.string().uuid()).default([]),
    images: z.array(projectImageInputSchema).default([]),
  });

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function parseProjectForm(formData: FormData) {
  const technologyIds = formData.getAll("technologyIds").map(String);
  const imagesRaw = formData.get("imagesJson");
  let images: z.infer<typeof projectImageInputSchema>[] = [];

  if (typeof imagesRaw === "string" && imagesRaw.trim()) {
    images = z.array(projectImageInputSchema).parse(JSON.parse(imagesRaw));
  }

  return projectFormSchema.parse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    locale: localeSchema.parse(String(formData.get("locale") ?? "es")),
    category: String(formData.get("category") ?? ""),
    problem: String(formData.get("problem") ?? ""),
    solution: String(formData.get("solution") ?? ""),
    result: String(formData.get("result") ?? ""),
    content: emptyToNull(formData.get("content")),
    githubUrl: emptyToNull(formData.get("githubUrl")),
    demoUrl: emptyToNull(formData.get("demoUrl")),
    featured: formData.get("featured") === "on",
    status: z.enum(["draft", "published"]).parse(
      String(formData.get("status") ?? "draft"),
    ),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    technologyIds,
    images,
    seoTitle: emptyToNull(formData.get("seoTitle")),
    seoDescription: emptyToNull(formData.get("seoDescription")),
    seoOgImage: emptyToNull(formData.get("seoOgImage")),
    seoCanonical: emptyToNull(formData.get("seoCanonical")),
    seoNoindex: formData.get("seoNoindex") === "on",
  });
}

export type ActionState = {
  error?: string;
  success?: string;
};

export async function createProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  let createdId: string;

  try {
    const input = parseProjectForm(formData);

    const slugTaken = await projectRepo.slugExists(input.slug, {
      locale: input.locale,
    });
    if (slugTaken) {
      return { error: "El slug ya existe para este idioma." };
    }

    const project = await projectRepo.create(input);
    await revalidateEntity("projects");
    createdId = project.id;
  } catch (error) {
    if (error instanceof MediaValidationError) {
      return { error: error.message };
    }
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error ? error.message : "No se pudo crear el proyecto.",
    };
  }

  redirect(`/admin/projects/${createdId}?created=1`);
}

export async function updateProject(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const input = parseProjectForm(formData);

    const slugTaken = await projectRepo.slugExists(input.slug, {
      locale: input.locale,
      excludeId: id,
    });
    if (slugTaken) {
      return { error: "El slug ya existe para este idioma." };
    }

    const project = await projectRepo.update(id, {
      ...input,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      seoOgImage: input.seoOgImage,
      seoCanonical: input.seoCanonical,
      seoNoindex: input.seoNoindex,
    });

    await revalidateEntity("project", { slug: project.slug });
    return { success: "Proyecto guardado." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el proyecto.",
    };
  }
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();
  const project = await projectRepo.getById(id, true);
  await projectRepo.remove(id);
  await revalidateEntity("projects");
  if (project) {
    await revalidateEntity("project", { slug: project.slug });
  }
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function publishProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("projectId") ?? "");

  try {
    await publishProjectService(id);
    revalidatePath(`/admin/projects/${id}`);
    return { success: "Proyecto publicado." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "No se pudo publicar.",
    };
  }
}

export async function uploadProjectImage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { url?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona una imagen." };
  }

  const altText = String(formData.get("altText") ?? "");

  try {
    const { publicUrl } = await uploadImage(file, altText);
    return { success: "Imagen subida.", url: publicUrl };
  } catch (error) {
    if (error instanceof MediaValidationError) {
      return { error: error.message };
    }
    return {
      error:
        error instanceof Error ? error.message : "Error al subir la imagen.",
    };
  }
}

export async function suggestProjectSlug(title: string, locale: string) {
  await requireAdmin();
  const parsedLocale = localeSchema.parse(locale);
  const base = generateSlug(title);
  let candidate = base;

  for (let attempt = 1; attempt <= 100; attempt += 1) {
    const taken = await projectRepo.slugExists(candidate, {
      locale: parsedLocale,
    });
    if (!taken) return candidate;
    candidate = `${base}-${attempt}`;
  }

  return `${base}-${Date.now()}`;
}

export async function reorderProjectImages(
  projectId: string,
  images: Array<{ imageUrl: string; altText: string; sortOrder: number }>,
): Promise<ActionState> {
  await requireAdmin();

  try {
    await projectRepo.syncProjectImages(projectId, images);
    await revalidateEntity("projects");
    return { success: "Orden actualizado." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "No se pudo reordenar.",
    };
  }
}
