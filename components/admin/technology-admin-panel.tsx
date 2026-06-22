"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import {
  createTechnology,
  deleteTechnology,
  suggestTechnologySlug,
  updateTechnology,
  type ActionState,
} from "@/app/admin/technologies/actions";
import type { Technology } from "@/lib/schemas/technology";
import {
  TECH_CATEGORY_LABELS,
  TECH_CATEGORY_ORDER,
} from "@/lib/utils/tech-categories";
import { slugify } from "@/lib/utils/slug";

type TechnologyAdminPanelProps = {
  technologies: Technology[];
};

const initialState: ActionState = {};

function emptyField(value: string | null | undefined) {
  return value ?? "";
}

export function TechnologyAdminPanel({ technologies }: TechnologyAdminPanelProps) {
  const [editing, setEditing] = useState<Technology | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = useCallback(() => {
    setEditing(null);
    dialogRef.current?.close();
  }, []);

  const submitAction = useCallback(
    async (prev: ActionState, formData: FormData): Promise<ActionState> => {
      const result = editing
        ? await updateTechnology(editing.id, prev, formData)
        : await createTechnology(prev, formData);

      if (result.success) {
        closeDialog();
      }

      return result;
    },
    [closeDialog, editing],
  );

  const [state, formAction, pending] = useActionState(submitAction, initialState);

  const openCreate = () => {
    setEditing(null);
    dialogRef.current?.showModal();
  };

  const openEdit = (technology: Technology) => {
    setEditing(technology);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button type="button" onClick={openCreate} className="btn-primary text-sm px-5 min-h-10">
          Nueva tecnología
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-surface/80 text-left text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Icono</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {technologies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                  No hay tecnologías registradas.
                </td>
              </tr>
            ) : (
              technologies.map((tech) => (
                <tr key={tech.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-text-primary">{tech.name}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{tech.slug}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {TECH_CATEGORY_LABELS[tech.category]}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {tech.iconUrl ? (
                      <a
                        href={tech.iconUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline truncate block max-w-[12rem]"
                      >
                        URL
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(tech)}
                        className="text-accent hover:underline"
                      >
                        Editar
                      </button>
                      <DeleteTechnologyButton id={tech.id} name={tech.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <dialog
        ref={dialogRef}
        onClose={closeDialog}
        className="w-full max-w-lg rounded-xl border border-border bg-background p-0 text-text-primary backdrop:bg-black/60"
      >
        <form action={formAction} className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-xl font-semibold">
              {editing ? "Editar tecnología" : "Nueva tecnología"}
            </h2>
            <button
              type="button"
              onClick={closeDialog}
              className="text-text-muted hover:text-text-primary"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {state.error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {state.error}
            </p>
          ) : null}

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Nombre</span>
            <input
              name="name"
              required
              key={`name-${editing?.id ?? "new"}`}
              defaultValue={editing?.name}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
              onBlur={async (event) => {
                const form = event.currentTarget.form;
                const slugInput = form?.elements.namedItem("slug") as HTMLInputElement | null;
                if (!slugInput || slugInput.value.trim()) return;
                const name = event.target.value.trim();
                if (!name) return;
                slugInput.value = await suggestTechnologySlug(name);
              }}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Slug</span>
            <input
              name="slug"
              required
              key={`slug-${editing?.id ?? "new"}`}
              defaultValue={editing?.slug}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary"
              onBlur={(event) => {
                event.target.value = slugify(event.target.value) || "untitled";
              }}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Categoría</span>
            <select
              name="category"
              required
              key={`category-${editing?.id ?? "new"}`}
              defaultValue={editing?.category ?? "language"}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            >
              {TECH_CATEGORY_ORDER.map((category) => (
                <option key={category} value={category}>
                  {TECH_CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">URL del icono (opcional)</span>
            <input
              name="iconUrl"
              type="url"
              key={`icon-${editing?.id ?? "new"}`}
              defaultValue={emptyField(editing?.iconUrl)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="btn-primary text-sm px-5 min-h-10"
              disabled={pending}
            >
              {pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear"}
            </button>
            <button
              type="button"
              onClick={closeDialog}
              className="btn-secondary text-sm px-5 min-h-10"
            >
              Cancelar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

function DeleteTechnologyButton({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState(deleteTechnology.bind(null, id), initialState);

  return (
    <form action={action}>
      {state.error ? (
        <p className="sr-only" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        className="text-red-400 hover:underline"
        disabled={pending}
        onClick={(event) => {
          if (!window.confirm(`¿Eliminar "${name}" permanentemente?`)) {
            event.preventDefault();
          }
        }}
      >
        {pending ? "Eliminando…" : "Eliminar"}
      </button>
    </form>
  );
}
