"use client";

import { useActionState, useState } from "react";
import { updateHeroContent, type ActionState } from "@/app/admin/pages/actions";
import type { HeroContent } from "@/lib/schemas/page-content";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

type HeroFormProps = {
  content: HeroContent;
  locale: Locale;
};

type MetricRow = HeroContent["metrics"][number];

const initialState: ActionState = {};

export function HeroForm({ content, locale }: HeroFormProps) {
  const [metrics, setMetrics] = useState<MetricRow[]>(
    content.metrics.length ? content.metrics : [
      { label: "", value: "", description: "", variant: "default" },
    ],
  );
  const [state, action, pending] = useActionState(updateHeroContent, initialState);

  const updateMetric = (index: number, patch: Partial<MetricRow>) => {
    setMetrics((current) =>
      current.map((metric, i) => (i === index ? { ...metric, ...patch } : metric)),
    );
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
        <TextField name="name" label="Nombre" defaultValue={content.name} />
        <TextField name="headline" label="Headline" defaultValue={content.headline} />
        <TextField name="subheadline" label="Subheadline" defaultValue={content.subheadline} className="lg:col-span-2" />
        <TextArea name="bio" label="Bio" defaultValue={content.bio} className="lg:col-span-2" />
        <TextField name="photoUrl" label="URL foto" defaultValue={content.photoUrl} type="url" className="lg:col-span-2" />
        <TextField name="cvUrl" label="URL CV (opcional)" defaultValue={content.cvUrl} className="lg:col-span-2" />
        <TextField name="github" label="GitHub" defaultValue={content.socialLinks.github} type="url" />
        <TextField name="linkedin" label="LinkedIn" defaultValue={content.socialLinks.linkedin} type="url" />
        <TextField name="email" label="Email" defaultValue={content.socialLinks.email} type="email" className="lg:col-span-2" />
        <TextField name="availabilityLabel" label="Etiqueta disponibilidad" defaultValue={content.availability.label} />
        <label className="flex items-center gap-2 text-sm self-end">
          <input type="checkbox" name="availabilityVisible" defaultChecked={content.availability.visible} className="accent-accent" />
          <span className="font-medium text-text-primary">Mostrar disponibilidad</span>
        </label>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-text-primary mb-2">Métricas</legend>
        {metrics.map((metric, index) => (
          <div key={index} className="grid gap-3 rounded-lg border border-border p-4 lg:grid-cols-2">
            <input type="hidden" name="metricLabel" value={metric.label} />
            <input type="hidden" name="metricValue" value={metric.value} />
            <input type="hidden" name="metricDescription" value={metric.description} />
            <input type="hidden" name="metricVariant" value={metric.variant} />
            <label className="block text-sm">
              <span className="font-medium text-text-primary">Label</span>
              <input value={metric.label} onChange={(e) => updateMetric(index, { label: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-text-primary">Valor</span>
              <input value={metric.value} onChange={(e) => updateMetric(index, { value: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm lg:col-span-2">
              <span className="font-medium text-text-primary">Descripción</span>
              <input value={metric.description} onChange={(e) => updateMetric(index, { description: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-text-primary">Variante</span>
              <select value={metric.variant} onChange={(e) => updateMetric(index, { variant: e.target.value as MetricRow["variant"] })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                <option value="default">Default</option>
                <option value="highlight">Highlight</option>
              </select>
            </label>
            <div className="flex items-end">
              <button type="button" onClick={() => setMetrics((c) => c.filter((_, i) => i !== index))} className="btn-secondary text-sm px-3 min-h-10" disabled={metrics.length === 1}>Eliminar</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setMetrics((c) => [...c, { label: "", value: "", description: "", variant: "default" }])} className="btn-secondary text-sm px-4 min-h-10">Añadir métrica</button>
      </fieldset>

      <SubmitButton pending={pending} />
    </form>
  );
}

function TextField({ name, label, defaultValue, type = "text", className = "" }: { name: string; label: string; defaultValue: string; type?: string; className?: string }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="font-medium text-text-primary">{label}</span>
      <input name={name} type={type} required={type !== "text" && name !== "cvUrl"} defaultValue={defaultValue} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
    </label>
  );
}

function TextArea({ name, label, defaultValue, className = "" }: { name: string; label: string; defaultValue: string; className?: string }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="font-medium text-text-primary">{label}</span>
      <textarea name={name} rows={3} defaultValue={defaultValue} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
    </label>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button type="submit" className="btn-primary text-sm px-5 min-h-10" disabled={pending}>
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {locales.map((item) => (
        <a
          key={item}
          href={`?locale=${item}`}
          className={item === locale ? "btn-primary text-sm px-4 min-h-10" : "btn-secondary text-sm px-4 min-h-10"}
        >
          {item.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
