"use client";

import Link from "next/link";
import { useActionState, useCallback, useState } from "react";
import {
  createProject,
  deleteProject,
  publishProjectAction,
  suggestProjectSlug,
  updateProject,
  type ActionState,
} from "@/app/admin/projects/actions";
import { ProjectImageManager } from "@/components/admin/project-image-manager";
import { TechnologyPicker } from "@/components/admin/technology-picker";
import { slugify } from "@/lib/utils/slug";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import type { ProjectImageInput, ProjectWithTechnologies } from "@/lib/schemas/project";
import type { Technology } from "@/lib/schemas/technology";

type ProjectFormProps = {
  project?: ProjectWithTechnologies;
  technologies: Technology[];
};

const initialState: ActionState = {};

function emptyField(value: string | null | undefined) {
  return value ?? "";
}

export function ProjectForm({ project, technologies }: ProjectFormProps) {
  const isEdit = Boolean(project);
  const [images, setImages] = useState<ProjectImageInput[]>(
    project?.images.map((image) => ({
      imageUrl: image.imageUrl,
      altText: image.altText,
      sortOrder: image.sortOrder,
    })) ?? [],
  );
  const [seoOpen, setSeoOpen] = useState(false);

  const boundUpdate = useCallback(
    (prev: ActionState, formData: FormData) => {
      if (!project) {
        return { error: "Proyecto no encontrado." };
      }
      return updateProject(project.id, prev, formData);
    },
    [project],
  );

  const [createState, createAction, createPending] = useActionState(
    createProject,
    initialState,
  );
  const [updateState, updateAction, updatePending] = useActionState(
    boundUpdate,
    initialState,
  );

  const state = isEdit ? updateState : createState;
  const pending = isEdit ? updatePending : createPending;

  const handleTitleBlur = async (
    event: React.FocusEvent<HTMLInputElement>,
    slugInput: HTMLInputElement | null,
    localeSelect: HTMLSelectElement | null,
  ) => {
    if (!slugInput || slugInput.value.trim()) return;
    const title = event.target.value.trim();
    if (!title) return;
    const locale = (localeSelect?.value ?? "es") as Locale;
    const suggested = await suggestProjectSlug(title, locale);
    slugInput.value = suggested;
  };

  const defaultOgImage =
    emptyField(project?.seoOgImage) ||
    images[0]?.imageUrl ||
    emptyField(project?.coverImageUrl);

  return (
    <>
    <form
      action={isEdit ? updateAction : createAction}
      className="space-y-8"
    >
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />

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
            defaultValue={project?.title}
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
            defaultValue={project?.slug}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary font-mono text-sm"
            onBlur={(event) => {
              event.target.value = slugify(event.target.value) || "untitled";
            }}
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-text-primary">Idioma</span>
          <select
            name="locale"
            defaultValue={project?.locale ?? "es"}
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
          <span className="font-medium text-text-primary">Categoría</span>
          <input
            name="category"
            required
            defaultValue={project?.category}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="block text-sm lg:col-span-2">
          <span className="font-medium text-text-primary">Problema</span>
          <textarea
            name="problem"
            required
            rows={3}
            defaultValue={project?.problem}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="block text-sm lg:col-span-2">
          <span className="font-medium text-text-primary">Solución</span>
          <textarea
            name="solution"
            required
            rows={3}
            defaultValue={project?.solution}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="block text-sm lg:col-span-2">
          <span className="font-medium text-text-primary">Resultado</span>
          <textarea
            name="result"
            required
            rows={2}
            defaultValue={project?.result}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="block text-sm lg:col-span-2">
          <span className="font-medium text-text-primary">Contenido (markdown)</span>
          <textarea
            name="content"
            rows={6}
            defaultValue={emptyField(project?.content)}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary font-mono text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-text-primary">GitHub URL</span>
          <input
            name="githubUrl"
            type="url"
            defaultValue={emptyField(project?.githubUrl)}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-text-primary">Demo URL</span>
          <input
            name="demoUrl"
            type="url"
            defaultValue={emptyField(project?.demoUrl)}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-text-primary">Orden</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={project?.sortOrder ?? 0}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-text-primary">Estado</span>
          <select
            name="status"
            defaultValue={project?.status ?? "draft"}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm lg:col-span-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured}
            className="accent-accent"
          />
          <span className="font-medium text-text-primary">Destacado en home</span>
        </label>
      </div>

      <TechnologyPicker
        technologies={technologies}
        selectedIds={project?.technologies.map((tech) => tech.id) ?? []}
      />

      <ProjectImageManager initialImages={images} onChange={setImages} />

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
              defaultValue={emptyField(project?.seoTitle)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
          </label>
          <label className="block text-sm lg:col-span-2">
            <span className="font-medium text-text-primary">SEO description</span>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={emptyField(project?.seoDescription)}
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
              defaultValue={emptyField(project?.seoCanonical)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
          </label>
          <label className="flex items-center gap-2 text-sm lg:col-span-2">
            <input
              type="checkbox"
              name="seoNoindex"
              defaultChecked={project?.seoNoindex}
              className="accent-accent"
            />
            <span className="font-medium text-text-primary">No index</span>
          </label>
        </div>
      </details>

      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
        <button
          type="submit"
          className="btn-primary text-sm px-5 min-h-10"
          disabled={pending}
        >
          {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear proyecto"}
        </button>

        {!isEdit ? (
          <Link href="/admin/projects" className="btn-secondary text-sm px-5 min-h-10">
            Cancelar
          </Link>
        ) : null}
      </div>
    </form>

    {isEdit && project ? (
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <PublishButton projectId={project.id} />
        <DeleteProjectButton projectId={project.id} />
      </div>
    ) : null}
  </>
  );
}

function DeleteProjectButton({ projectId }: { projectId: string }) {
  return (
    <form action={deleteProject.bind(null, projectId)}>
      <button
        type="submit"
        className="btn-secondary text-sm px-5 min-h-10 text-red-400"
        onClick={(event) => {
          if (!window.confirm("¿Eliminar este proyecto permanentemente?")) {
            event.preventDefault();
          }
        }}
      >
        Eliminar
      </button>
    </form>
  );
}

function PublishButton({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(publishProjectAction, initialState);

  return (
    <form action={action}>
      <input type="hidden" name="projectId" value={projectId} />
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
        className="btn-secondary text-sm px-5 min-h-10"
        disabled={pending}
      >
        {pending ? "Publicando…" : "Publicar"}
      </button>
    </form>
  );
}
