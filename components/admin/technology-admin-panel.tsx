"use client";

import { useActionState, useCallback, useRef, useState, useTransition } from "react";
import { TechnologyTable } from "@/components/admin/technology-table";
import { TechnologyIcon } from "@/components/ui/technology-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createTechnology,
  deleteTechnology,
  suggestTechnologySlug,
  updateTechnology,
  uploadTechnologyIcon,
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

export function TechnologyAdminPanel({ technologies }: TechnologyAdminPanelProps) {
  const [editing, setEditing] = useState<Technology | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [iconUrl, setIconUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setEditing(null);
  }, []);

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setEditing(null);
      setUploadError(null);
    }
  };

  const submitAction = useCallback(
    async (prev: ActionState, formData: FormData): Promise<ActionState> => {
      const result = editing
        ? await updateTechnology(editing.id, prev, formData)
        : await createTechnology(prev, formData);

      if (result.success) {
        closeSheet();
      }

      return result;
    },
    [closeSheet, editing],
  );

  const [state, formAction, pending] = useActionState(submitAction, initialState);

  const openCreate = () => {
    setEditing(null);
    setIconUrl("");
    setUploadError(null);
    setSheetOpen(true);
  };

  const openEdit = (technology: Technology) => {
    setEditing(technology);
    setIconUrl(technology.iconUrl ?? "");
    setUploadError(null);
    setSheetOpen(true);
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    startUpload(async () => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("altText", "Technology icon");

      const result = await uploadTechnologyIcon({}, formData);
      if (result.error || !result.url) {
        setUploadError(result.error ?? "Error al subir el icono.");
        return;
      }

      setIconUrl(result.url);
    });

    event.target.value = "";
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button type="button" onClick={openCreate} className="btn-primary text-sm px-5 min-h-10">
          Nueva tecnología
        </button>
      </div>

      <TechnologyTable
        technologies={technologies}
        onEdit={openEdit}
        renderDeleteButton={(tech) => (
          <DeleteTechnologyButton id={tech.id} name={tech.name} />
        )}
      />

      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="flex w-full flex-col overflow-y-auto border-border bg-surface text-text-primary sm:max-w-md"
        >
          <SheetHeader className="border-b border-border bg-surface pb-4">
            <SheetTitle className="font-display text-xl text-text-primary">
              {editing ? "Editar tecnología" : "Nueva tecnología"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {editing
                ? "Modifica los datos de la tecnología seleccionada."
                : "Completa el formulario para registrar una nueva tecnología."}
            </SheetDescription>
          </SheetHeader>

          <form action={formAction} className="flex flex-1 flex-col gap-5 bg-surface px-4 py-5">
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

            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium text-text-primary">
                Icono (opcional)
              </legend>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only"
                onChange={handleIconUpload}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-sm px-4 min-h-10"
                  disabled={isUploading}
                >
                  {isUploading ? "Subiendo…" : "Subir icono"}
                </button>
                {iconUrl ? (
                  <button
                    type="button"
                    onClick={() => setIconUrl("")}
                    className="text-sm text-text-muted hover:text-text-primary"
                  >
                    Quitar
                  </button>
                ) : null}
              </div>
              {uploadError ? (
                <p className="text-sm text-red-400">{uploadError}</p>
              ) : null}
              <input type="hidden" name="iconUrl" value={iconUrl} />
              {iconUrl ? (
                <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-surface p-2">
                  <TechnologyIcon
                    src={iconUrl}
                    width={32}
                    height={32}
                    className="size-8"
                  />
                </div>
              ) : (
                <p className="text-xs text-text-muted">
                  PNG, WebP o SVG. Máx. 5 MB. Si no subes icono, se muestran las
                  iniciales del nombre.
                </p>
              )}
            </fieldset>

            <SheetFooter className="mt-auto flex-row gap-3 border-t border-border bg-surface px-0 pb-0 pt-4">
              <button
                type="submit"
                className="btn-primary text-sm px-5 min-h-10"
                disabled={pending}
              >
                {pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear"}
              </button>
              <button
                type="button"
                onClick={closeSheet}
                className="btn-secondary text-sm px-5 min-h-10"
              >
                Cancelar
              </button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
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
