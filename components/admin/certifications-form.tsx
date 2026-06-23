"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import {
  updateCertificationsContent,
  uploadCertificationAsset,
  type ActionState,
} from "@/app/admin/certifications/actions";
import { CertificationBadge } from "@/components/public/certification-badge";
import type { AchievementsContent, AchievementItem } from "@/lib/schemas/page-content";
import type { Locale } from "@/lib/i18n/config";
import {
  ACHIEVEMENT_BADGE_LABELS,
  ACHIEVEMENT_BADGE_ORDER,
} from "@/lib/utils/achievement-badges";

type CertificationsFormProps = {
  content: AchievementsContent;
  locale: Locale;
};

const initialState: ActionState = {};

export function CertificationsForm({ content, locale }: CertificationsFormProps) {
  const [items, setItems] = useState<AchievementItem[]>(
    content.items.length ? content.items : [{ title: "", meta: "", badge: "degree" }],
  );
  const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});
  const [isUploading, startUpload] = useTransition();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [state, action, pending] = useActionState(updateCertificationsContent, initialState);

  const updateItem = (index: number, patch: Partial<AchievementItem>) => {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      const currentItem = next[index];
      const targetItem = next[target];
      if (!currentItem || !targetItem) return current;
      next[index] = targetItem;
      next[target] = currentItem;
      return next;
    });
  };

  const handleAssetUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadErrors((current) => {
      const next = { ...current };
      delete next[index];
      return next;
    });
    setUploadingIndex(index);

    startUpload(async () => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("altText", items[index]?.title ?? "Certification");

      const result = await uploadCertificationAsset({}, formData);
      setUploadingIndex(null);

      if (result.error || !result.url) {
        setUploadErrors((current) => ({
          ...current,
          [index]: result.error ?? "Error al subir el archivo.",
        }));
        return;
      }

      if (result.kind === "pdf") {
        updateItem(index, { url: result.url });
      } else {
        updateItem(index, { imageUrl: result.url });
      }
    });

    event.target.value = "";
  };

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />

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
          <span className="font-medium text-text-primary">Label de sección</span>
          <input
            name="label"
            required
            defaultValue={content.label}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-text-primary">Título de sección</span>
          <input
            name="title"
            required
            defaultValue={content.title}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-sm font-medium text-text-primary">
          Certificaciones
        </legend>
        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-xl border border-border p-4">
            <input type="hidden" name="itemTitle" value={item.title} />
            <input type="hidden" name="itemMeta" value={item.meta} />
            <input type="hidden" name="itemBadge" value={item.badge} />
            <input type="hidden" name="itemUrl" value={item.url ?? ""} />
            <input type="hidden" name="itemImageUrl" value={item.imageUrl ?? ""} />

            <div className="flex items-start gap-4">
              <CertificationBadge item={item} className="size-12 shrink-0" />
              <div className="grid flex-1 gap-3 lg:grid-cols-2">
                <label className="block text-sm lg:col-span-2">
                  <span className="font-medium text-text-primary">Título</span>
                  <input
                    value={item.title}
                    onChange={(event) =>
                      updateItem(index, { title: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-text-primary">Meta</span>
                  <input
                    value={item.meta}
                    onChange={(event) =>
                      updateItem(index, { meta: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-text-primary">
                    Badge (fallback)
                  </span>
                  <select
                    value={item.badge}
                    onChange={(event) =>
                      updateItem(index, {
                        badge: event.target.value as AchievementItem["badge"],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  >
                    {ACHIEVEMENT_BADGE_ORDER.map((badge) => (
                      <option key={badge} value={badge}>
                        {ACHIEVEMENT_BADGE_LABELS[badge]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm lg:col-span-2">
                  <span className="font-medium text-text-primary">
                    URL de credencial (opcional)
                  </span>
                  <input
                    value={item.url ?? ""}
                    onChange={(event) =>
                      updateItem(index, { url: event.target.value || undefined })
                    }
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text-primary">
                Logo / imagen / diploma (opcional)
              </span>
              <input
                ref={(element) => {
                  fileInputRefs.current[index] = element;
                }}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                className="sr-only"
                onChange={(event) => handleAssetUpload(index, event)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[index]?.click()}
                  className="btn-secondary text-sm px-4 min-h-10"
                  disabled={isUploading && uploadingIndex === index}
                >
                  {isUploading && uploadingIndex === index
                    ? "Subiendo…"
                    : "Subir archivo"}
                </button>
                {item.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => updateItem(index, { imageUrl: undefined })}
                    className="text-sm text-text-muted hover:text-text-primary"
                  >
                    Quitar imagen
                  </button>
                ) : null}
              </div>
              {uploadErrors[index] ? (
                <p className="text-sm text-red-400">{uploadErrors[index]}</p>
              ) : null}
              <p className="text-xs text-text-muted">
                PNG, WebP, SVG o PDF. Imágenes se muestran como logo; PDFs se
                guardan como enlace de credencial. Si no subes archivo, se usa el
                badge seleccionado.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                className="btn-secondary text-sm px-3 min-h-9"
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                className="btn-secondary text-sm px-3 min-h-9"
                disabled={index === items.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    !window.confirm(
                      "¿Eliminar esta certificación de la lista?",
                    )
                  ) {
                    return;
                  }
                  setItems((current) => current.filter((_, i) => i !== index));
                }}
                className="btn-secondary text-sm px-3 min-h-9 text-red-400"
                disabled={items.length === 1}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setItems((current) => [
              ...current,
              { title: "", meta: "", badge: "degree" },
            ])
          }
          className="btn-secondary text-sm px-4 min-h-10"
        >
          Añadir certificación
        </button>
      </fieldset>

      <button type="submit" className="btn-primary text-sm px-5 min-h-10" disabled={pending}>
        {pending ? "Guardando…" : "Guardar certificaciones"}
      </button>
    </form>
  );
}
