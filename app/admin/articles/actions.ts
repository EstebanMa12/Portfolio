"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  generateSlug,
  publishArticle as publishArticleService,
} from "@/lib/domain/content/content-service";
import { markdownToHtml } from "@/lib/markdown/render";
import { uploadImage, MediaValidationError } from "@/lib/domain/media/media-service";
import { articleInsertSchema } from "@/lib/schemas/article";
import { seoFieldsSchema } from "@/lib/schemas/common";
import { localeSchema } from "@/lib/schemas/locale";
import * as articleRepo from "@/lib/repositories/article-repo";
import { revalidateEntity } from "@/lib/revalidate";

const articleFormSchema = articleInsertSchema.merge(seoFieldsSchema);

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (raw == null) return [];
  return String(raw)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseArticleForm(formData: FormData) {
  return articleFormSchema.parse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    locale: localeSchema.parse(String(formData.get("locale") ?? "es")),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    tags: parseTags(formData.get("tags")),
    coverImageUrl: emptyToNull(formData.get("coverImageUrl")),
    status: z.enum(["draft", "published"]).parse(
      String(formData.get("status") ?? "draft"),
    ),
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

export async function createArticle(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  let createdId: string;

  try {
    const input = parseArticleForm(formData);

    const slugTaken = await articleRepo.slugExists(input.slug, {
      locale: input.locale,
    });
    if (slugTaken) {
      return { error: "El slug ya existe para este idioma." };
    }

    const article = await articleRepo.create(input);
    await revalidateEntity("articles");
    createdId = article.id;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error ? error.message : "No se pudo crear el artículo.",
    };
  }

  redirect(`/admin/articles/${createdId}?created=1`);
}

export async function updateArticle(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  try {
    const input = parseArticleForm(formData);

    const slugTaken = await articleRepo.slugExists(input.slug, {
      locale: input.locale,
      excludeId: id,
    });
    if (slugTaken) {
      return { error: "El slug ya existe para este idioma." };
    }

    const article = await articleRepo.update(id, {
      ...input,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      seoOgImage: input.seoOgImage,
      seoCanonical: input.seoCanonical,
      seoNoindex: input.seoNoindex,
    });

    await revalidateEntity("article", { slug: article.slug });
    return { success: "Artículo guardado." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Revisa los campos del formulario." };
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el artículo.",
    };
  }
}

export async function deleteArticle(id: string): Promise<void> {
  await requireAdmin();
  const article = await articleRepo.getById(id, true);
  await articleRepo.remove(id);
  await revalidateEntity("articles");
  if (article) {
    await revalidateEntity("article", { slug: article.slug });
  }
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function publishArticleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("articleId") ?? "");

  try {
    await publishArticleService(id);
    revalidatePath(`/admin/articles/${id}`);
    return { success: "Artículo publicado." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "No se pudo publicar.",
    };
  }
}

export async function uploadArticleCover(
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
    return { success: "Portada subida.", url: publicUrl };
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

export async function suggestArticleSlug(title: string, locale: string) {
  await requireAdmin();
  const parsedLocale = localeSchema.parse(locale);
  const base = generateSlug(title);
  let candidate = base;

  for (let attempt = 1; attempt <= 100; attempt += 1) {
    const taken = await articleRepo.slugExists(candidate, {
      locale: parsedLocale,
    });
    if (!taken) return candidate;
    candidate = `${base}-${attempt}`;
  }

  return `${base}-${Date.now()}`;
}

export async function previewMarkdown(content: string): Promise<string> {
  await requireAdmin();
  if (!content.trim()) return "";
  return markdownToHtml(content);
}
