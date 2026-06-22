"use client";

import Image from "next/image";
import { useCallback, useRef, useState, useTransition } from "react";
import {
  uploadProjectImage,
  type ActionState,
} from "@/app/admin/projects/actions";
import type { ProjectImageInput } from "@/lib/schemas/project";

type ManagedImage = ProjectImageInput & {
  clientId: string;
};

type ProjectImageManagerProps = {
  initialImages: ProjectImageInput[];
  onChange: (images: ProjectImageInput[]) => void;
};

function toManagedImages(images: ProjectImageInput[]): ManagedImage[] {
  return images.map((image, index) => ({
    ...image,
    sortOrder: index,
    clientId: `${image.imageUrl}-${index}`,
  }));
}

function normalizeImages(images: ManagedImage[]): ProjectImageInput[] {
  return images.map((image, index) => ({
    imageUrl: image.imageUrl,
    altText: image.altText,
    sortOrder: index,
  }));
}

export function ProjectImageManager({
  initialImages,
  onChange,
}: ProjectImageManagerProps) {
  const [images, setImages] = useState<ManagedImage[]>(() =>
    toManagedImages(initialImages),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commit = useCallback(
    (next: ManagedImage[]) => {
      const normalized = normalizeImages(next);
      setImages(
        normalized.map((image, index) => ({
          ...image,
          clientId: `${image.imageUrl}-${index}`,
        })),
      );
      onChange(normalized);
    },
    [onChange],
  );

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setError(null);
    startTransition(async () => {
      const uploaded: ProjectImageInput[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        const result: ActionState & { url?: string } =
          await uploadProjectImage({}, formData);

        if (result.error || !result.url) {
          setError(result.error ?? "Error al subir imagen.");
          continue;
        }

        uploaded.push({
          imageUrl: result.url,
          altText: "",
          sortOrder: images.length + uploaded.length,
        });
      }

      if (uploaded.length > 0) {
        commit([
          ...images,
          ...uploaded.map((image, index) => ({
            ...image,
            clientId: `${image.imageUrl}-${images.length + index}`,
          })),
        ]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const current = next[index];
    const swap = next[target];
    if (!current || !swap) return;
    next[index] = swap;
    next[target] = current;
    commit(next);
  };

  const updateAlt = (index: number, altText: string) => {
    const next = images.map((image, i) =>
      i === index ? { ...image, altText } : image,
    );
    commit(next);
  };

  const removeImage = (index: number) => {
    if (!window.confirm("¿Eliminar esta imagen de la galería?")) return;
    commit(images.filter((_, i) => i !== index));
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-text-primary">Galería</h3>
          <p className="text-xs text-text-muted mt-1">
            La primera imagen se usa como portada (cover).
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            multiple
            className="sr-only"
            id="project-image-upload"
            onChange={handleUpload}
            disabled={isPending}
          />
          <label
            htmlFor="project-image-upload"
            className="btn-secondary text-sm px-4 min-h-10 inline-flex items-center cursor-pointer"
          >
            {isPending ? "Subiendo…" : "Subir imágenes"}
          </label>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      {images.length === 0 ? (
        <p className="text-sm text-text-muted border border-dashed border-border rounded-lg p-6 text-center">
          Opcional: imágenes para la galería del listado. Sin ellas se muestra un
          placeholder.
        </p>
      ) : (
        <ul className="space-y-3">
          {images.map((image, index) => (
            <li
              key={image.clientId}
              className="flex flex-col sm:flex-row gap-4 rounded-lg border border-border p-3"
            >
              <div className="relative w-full sm:w-40 aspect-video shrink-0 overflow-hidden rounded-md border border-border">
                <Image
                  src={image.imageUrl}
                  alt={image.altText || `Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="block text-xs font-medium text-text-muted">
                  Alt text
                  <input
                    type="text"
                    value={image.altText}
                    onChange={(event) => updateAlt(index, event.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
                    placeholder="Descripción accesible de la imagen"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-secondary text-xs px-3 min-h-8"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Mover arriba"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-xs px-3 min-h-8"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label="Mover abajo"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-xs px-3 min-h-8 text-red-400"
                    onClick={() => removeImage(index)}
                  >
                    Eliminar
                  </button>
                  {index === 0 ? (
                    <span className="text-xs text-accent self-center">Portada</span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
