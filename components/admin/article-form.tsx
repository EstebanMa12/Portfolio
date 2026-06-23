"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useCallback, useRef, useState, useTransition } from "react";
import {
  createArticle,
  deleteArticle,
  publishArticleAction,
  unpublishArticleAction,
  suggestArticleSlug,
  updateArticle,
  uploadArticleCover,
  type ActionState,
} from "@/app/admin/articles/actions";
import { MarkdownPreview } from "@/components/admin/markdown-preview";
import { slugify } from "@/lib/utils/slug";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import type { Article } from "@/lib/schemas/article";

type ArticleFormProps = {
  article?: Article;
};

const EXCERPT_MIN = 160;
const EXCERPT_MAX = 320;
const initialState: ActionState = {};

function emptyField(value: string | null | undefined) {
  return value ?? "";
}

export function ArticleForm({ article }: ArticleFormProps) {
  const isEdit = Boolean(article);
  const [content, setContent] = useState(article?.content ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    emptyField(article?.coverImageUrl),
  );
  const [seoOpen, setSeoOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();

  const boundUpdate = useCallback(
    (prev: ActionState, formData: FormData) => {
      if (!article) {
        return { error: "Artículo no encontrado." };
      }
      return updateArticle(article.id, prev, formData);
    },
    [article],
  );

  const [createState, createAction, createPending] = useActionState(
    createArticle,
    initialState,
  );
  const [updateState, updateAction, updatePending] = useActionState(
    boundUpdate,
    initialState,
  );

  const state = isEdit ? updateState : createState;
  const pending = isEdit ? updatePending : createPending;

  const excerptCount = excerpt.length;
  const excerptValid = excerptCount >= EXCERPT_MIN && excerptCount <= EXCERPT_MAX;

  const handleTitleBlur = async (
    event: React.FocusEvent<HTMLInputElement>,
    slugInput: HTMLInputElement | null,
    localeSelect: HTMLSelectElement | null,
  ) => {
    if (!slugInput || slugInput.value.trim()) return;
    const title = event.target.value.trim();
    if (!title) return;
    const locale = (localeSelect?.value ?? "es") as Locale;
    const suggested = await suggestArticleSlug(title, locale);
    slugInput.value = suggested;
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    startUpload(async () => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("altText", "Article cover");

      const result = await uploadArticleCover({}, formData);
      if (result.error || !result.url) {
        setUploadError(result.error ?? "Error al subir la portada.");
        return;
      }

      setCoverImageUrl(result.url);
    });

    event.target.value = "";
  };

  const defaultOgImage =
    emptyField(article?.seoOgImage) || coverImageUrl || "";

  return (
    <>
      <form action={isEdit ? updateAction : createAction} className="space-y-8">
        {state.error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
            {state.success}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-text-primary">Título</span>
            <input
              name="title"
              required
              data-testid="article-title"
              defaultValue={article?.title}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              onBlur={(event) => {
                const form = event.currentTarget.form;
                handleTitleBlur(
                  event,
                  form?.elements.namedItem("slug") as HTMLInputElement | null,
                  form?.elements.namedItem("locale") as HTMLSelectElement | null,
                );
              }}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Slug</span>
            <input
              name="slug"
              required
              data-testid="article-slug"
              defaultValue={article?.slug}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary"
              onBlur={(event) => {
                event.target.value = slugify(event.target.value) || "untitled";
              }}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Idioma</span>
            <select
              name="locale"
              defaultValue={article?.locale ?? "es"}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            >
              {locales.map((locale) => (
                <option key={locale} value={locale}>
                  {locale.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Estado</span>
            <select
              name="status"
              defaultValue={article?.status ?? "draft"}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </label>

          <label className="block text-sm lg:col-span-2">
            <span className="font-medium text-text-primary">
              Extracto ({EXCERPT_MIN}–{EXCERPT_MAX} caracteres)
            </span>
            <textarea
              name="excerpt"
              required
              rows={3}
              data-testid="article-excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
            <span
              className={
                excerptValid
                  ? "mt-1 block text-xs text-text-muted"
                  : "mt-1 block text-xs text-red-400"
              }
            >
              {excerptCount} / {EXCERPT_MAX}
              {excerptCount < EXCERPT_MIN
                ? ` · faltan ${EXCERPT_MIN - excerptCount}`
                : null}
            </span>
          </label>

          <label className="block text-sm lg:col-span-2">
            <span className="font-medium text-text-primary">Tags (separados por coma)</span>
            <input
              name="tags"
              defaultValue={article?.tags.join(", ")}
              placeholder="go, arquitectura, backend"
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-text-primary">Portada</legend>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleCoverUpload}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary text-sm px-4 min-h-10"
              disabled={isUploading}
            >
              {isUploading ? "Subiendo…" : "Subir imagen"}
            </button>
            {coverImageUrl ? (
              <button
                type="button"
                onClick={() => setCoverImageUrl("")}
                className="text-sm text-text-muted hover:text-text-primary"
              >
                Quitar
              </button>
            ) : null}
          </div>
          {uploadError ? (
            <p className="text-sm text-red-400">{uploadError}</p>
          ) : null}
          <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
          {coverImageUrl ? (
            <div className="relative mt-2 h-40 w-full max-w-md overflow-hidden rounded-lg border border-border">
              <Image
                src={coverImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          ) : null}
        </fieldset>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-text-primary">Contenido (markdown)</span>
            <textarea
              name="content"
              required
              rows={18}
              data-testid="article-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary"
            />
          </label>

          <div className="rounded-lg border border-border bg-surface/50 p-4 overflow-auto max-h-[32rem]">
            <p className="text-xs uppercase tracking-wider text-text-muted mb-3">
              Vista previa
            </p>
            <MarkdownPreview content={content} />
          </div>
        </div>

        <details
          open={seoOpen}
          onToggle={(event) => setSeoOpen(event.currentTarget.open)}
          className="rounded-lg border border-border p-4"
        >
          <summary className="cursor-pointer text-sm font-medium text-text-primary">
            SEO
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="block text-sm lg:col-span-2">
              <span className="font-medium text-text-primary">SEO title</span>
              <input
                name="seoTitle"
                defaultValue={emptyField(article?.seoTitle)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              />
            </label>
            <label className="block text-sm lg:col-span-2">
              <span className="font-medium text-text-primary">SEO description</span>
              <textarea
                name="seoDescription"
                rows={2}
                defaultValue={emptyField(article?.seoDescription)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              />
            </label>
            <label className="block text-sm lg:col-span-2">
              <span className="font-medium text-text-primary">OG image URL</span>
              <input
                name="seoOgImage"
                type="url"
                defaultValue={defaultOgImage}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              />
            </label>
            <label className="block text-sm lg:col-span-2">
              <span className="font-medium text-text-primary">Canonical URL</span>
              <input
                name="seoCanonical"
                type="url"
                defaultValue={emptyField(article?.seoCanonical)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              />
            </label>
            <label className="flex items-center gap-2 text-sm lg:col-span-2">
              <input
                type="checkbox"
                name="seoNoindex"
                defaultChecked={article?.seoNoindex}
                className="accent-accent"
              />
              <span className="font-medium text-text-primary">No index</span>
            </label>
          </div>
        </details>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
          <button
            type="submit"
            data-testid="article-submit"
            className="btn-primary text-sm px-5 min-h-10"
            disabled={pending || !excerptValid}
          >
            {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear artículo"}
          </button>

          {!isEdit ? (
            <Link href="/admin/articles" className="btn-secondary text-sm px-5 min-h-10">
              Cancelar
            </Link>
          ) : null}
        </div>
      </form>

      {isEdit && article ? (
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <PublishStatusButton articleId={article.id} status={article.status} />
          <DeleteArticleButton articleId={article.id} />
        </div>
      ) : null}
    </>
  );
}

function DeleteArticleButton({ articleId }: { articleId: string }) {
  return (
    <form action={deleteArticle.bind(null, articleId)}>
      <button
        type="submit"
        className="btn-secondary text-sm px-5 min-h-10 text-red-400"
        onClick={(event) => {
          if (!window.confirm("¿Eliminar este artículo permanentemente?")) {
            event.preventDefault();
          }
        }}
      >
        Eliminar
      </button>
    </form>
  );
}

function PublishStatusButton({
  articleId,
  status,
}: {
  articleId: string;
  status: "draft" | "published";
}) {
  const isPublished = status === "published";
  const action = isPublished ? unpublishArticleAction : publishArticleAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="articleId" value={articleId} />
      {state.error ? (
        <p className="sr-only" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="sr-only" role="status">
          {state.success}
        </p>
      ) : null}
      <button
        type="submit"
        data-testid="article-publish"
        className="btn-secondary text-sm px-5 min-h-10"
        disabled={pending}
      >
        {pending
          ? isPublished
            ? "Despublicando…"
            : "Publicando…"
          : isPublished
            ? "Despublicar"
            : "Publicar"}
      </button>
    </form>
  );
}
