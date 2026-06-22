"use client";

import { useActionState, useState } from "react";
import { updateAboutContent, type ActionState } from "@/app/admin/pages/actions";
import type { AboutContent } from "@/lib/schemas/page-content";
import type { Locale } from "@/lib/i18n/config";

type AboutFormProps = {
  content: AboutContent;
  locale: Locale;
};

type BioBridgeRow = AboutContent["bioBridge"][number];

const initialState: ActionState = {};

export function AboutForm({ content, locale }: AboutFormProps) {
  const [paragraphs, setParagraphs] = useState<string[]>(
    content.paragraphs.length ? content.paragraphs : [""],
  );
  const [bioBridge, setBioBridge] = useState<BioBridgeRow[]>(
    content.bioBridge.length ? content.bioBridge : [{ from: "", to: "" }],
  );
  const [state, action, pending] = useActionState(updateAboutContent, initialState);

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />
      {state.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{state.success}</p>
      ) : null}

      <label className="block text-sm">
        <span className="font-medium text-text-primary">Título</span>
        <input name="title" required defaultValue={content.title} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-text-primary mb-2">Párrafos</legend>
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="flex gap-2">
            <textarea name="paragraphs" value={paragraph} onChange={(e) => setParagraphs((c) => c.map((p, i) => (i === index ? e.target.value : p)))} rows={3} className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary" />
            <button type="button" onClick={() => setParagraphs((c) => c.filter((_, i) => i !== index))} className="btn-secondary text-sm px-3 min-h-10" disabled={paragraphs.length === 1}>−</button>
          </div>
        ))}
        <button type="button" onClick={() => setParagraphs((c) => [...c, ""])} className="btn-secondary text-sm px-4 min-h-10">Añadir párrafo</button>
      </fieldset>

      <label className="block text-sm">
        <span className="font-medium text-text-primary">Intereses (separados por coma)</span>
        <input name="interests" defaultValue={content.interests.join(", ")} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-text-primary mb-2">Bio Bridge</legend>
        {bioBridge.map((row, index) => (
          <div key={index} className="grid gap-3 rounded-lg border border-border p-4 lg:grid-cols-2">
            <input type="hidden" name="bioBridgeFrom" value={row.from} />
            <input type="hidden" name="bioBridgeTo" value={row.to} />
            <label className="block text-sm">
              <span className="font-medium text-text-primary">Origen (bio)</span>
              <input value={row.from} onChange={(e) => setBioBridge((c) => c.map((item, i) => (i === index ? { ...item, from: e.target.value } : item)))} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-text-primary">Destino (tech)</span>
              <input value={row.to} onChange={(e) => setBioBridge((c) => c.map((item, i) => (i === index ? { ...item, to: e.target.value } : item)))} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </label>
            <div className="lg:col-span-2">
              <button type="button" onClick={() => setBioBridge((c) => c.filter((_, i) => i !== index))} className="btn-secondary text-sm px-3 min-h-10" disabled={bioBridge.length === 1}>Eliminar fila</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setBioBridge((c) => [...c, { from: "", to: "" }])} className="btn-secondary text-sm px-4 min-h-10">Añadir fila</button>
      </fieldset>

      <button type="submit" className="btn-primary text-sm px-5 min-h-10" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
