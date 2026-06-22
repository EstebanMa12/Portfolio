"use client";

import { useActionState, useState } from "react";
import { updateSeoSettings, type ActionState } from "@/app/admin/seo/actions";
import type { SeoSettings } from "@/lib/domain/seo/types";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

type SeoSettingsFormProps = {
  settings: SeoSettings;
  locale: Locale;
};

const initialState: ActionState = {};

function resolveTitle(template: string, pageTitle: string) {
  return template.includes("%s") ? template.replace("%s", pageTitle) : pageTitle;
}

export function SeoSettingsForm({ settings, locale }: SeoSettingsFormProps) {
  const [previewTitle, setPreviewTitle] = useState("Esteban Maya");
  const [formValues, setFormValues] = useState(settings);
  const [state, action, pending] = useActionState(updateSeoSettings, initialState);

  const resolvedTitle = resolveTitle(formValues.titleTemplate, previewTitle);
  const previewUrl = `${formValues.siteUrl.replace(/\/$/, "")}/`;

  return (
    <form
      action={action}
      className="space-y-8"
      onChange={(event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
        setFormValues((current) => ({
          ...current,
          [target.name]: target.value,
        }));
      }}
    >
      <input type="hidden" name="locale" value={locale} />

      {state.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{state.success}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-text-primary">Nombre del sitio</span>
          <input name="siteName" required defaultValue={settings.siteName} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-text-primary">URL del sitio</span>
          <input name="siteUrl" type="url" required defaultValue={settings.siteUrl} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
        </label>
        <label className="block text-sm lg:col-span-2">
          <span className="font-medium text-text-primary">Plantilla de título</span>
          <input name="titleTemplate" required defaultValue={settings.titleTemplate} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
        </label>
        <label className="block text-sm lg:col-span-2">
          <span className="font-medium text-text-primary">Descripción por defecto</span>
          <textarea name="defaultDescription" rows={3} required defaultValue={settings.defaultDescription} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
        </label>
        <label className="block text-sm lg:col-span-2">
          <span className="font-medium text-text-primary">OG image por defecto (URL)</span>
          <input name="defaultOgImage" type="url" defaultValue={settings.defaultOgImage ?? ""} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
        </label>
        <label className="block text-sm lg:col-span-2">
          <span className="font-medium text-text-primary">Twitter handle</span>
          <input name="twitterHandle" defaultValue={settings.twitterHandle ?? ""} placeholder="@usuario" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
        </label>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <h2 className="text-sm font-medium text-text-primary mb-4">Preview Google</h2>
          <label className="block text-xs text-text-muted mb-2">
            Título de página de ejemplo
            <input
              value={previewTitle}
              onChange={(event) => setPreviewTitle(event.target.value)}
              className="mt-1 w-full rounded border border-border bg-surface px-2 py-1 text-sm text-text-primary"
            />
          </label>
          <p className="text-[#8ab4f8] text-lg leading-tight">{resolvedTitle}</p>
          <p className="text-[#006621] text-sm mt-1">{previewUrl}</p>
          <p className="text-sm text-text-secondary mt-2 line-clamp-2">{formValues.defaultDescription}</p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-text-primary">Preview OG card</h2>
          </div>
          {formValues.defaultOgImage ? (
            <div className="aspect-[1.91/1] bg-surface relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formValues.defaultOgImage} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[1.91/1] bg-surface flex items-center justify-center text-sm text-text-muted">
              Sin imagen OG
            </div>
          )}
          <div className="p-4 space-y-1">
            <p className="text-xs uppercase tracking-wide text-text-muted">{formValues.siteUrl.replace(/^https?:\/\//, "")}</p>
            <p className="font-medium text-text-primary line-clamp-1">{resolvedTitle}</p>
            <p className="text-sm text-text-secondary line-clamp-2">{formValues.defaultDescription}</p>
          </div>
        </div>
      </section>

      <button type="submit" className="btn-primary text-sm px-5 min-h-10" disabled={pending}>
        {pending ? "Guardando…" : "Guardar SEO"}
      </button>
    </form>
  );
}

export function LocaleSwitcher({ locale, basePath }: { locale: Locale; basePath: string }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {locales.map((item) => (
        <a
          key={item}
          href={`${basePath}?locale=${item}`}
          className={item === locale ? "btn-primary text-sm px-4 min-h-10" : "btn-secondary text-sm px-4 min-h-10"}
        >
          {item.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
