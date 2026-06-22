"use client";

import { useActionState, useState } from "react";
import { updateCertificationsContent, type ActionState } from "@/app/admin/certifications/actions";
import { CertBadge } from "@/components/public/cert-badge";
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

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />

      {state.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">{state.success}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-text-primary">Label de sección</span>
          <input name="label" required defaultValue={content.label} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-text-primary">Título de sección</span>
          <input name="title" required defaultValue={content.title} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
        </label>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-text-primary mb-2">Certificaciones</legend>
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-border p-4 space-y-3">
            <input type="hidden" name="itemTitle" value={item.title} />
            <input type="hidden" name="itemMeta" value={item.meta} />
            <input type="hidden" name="itemBadge" value={item.badge} />
            <input type="hidden" name="itemUrl" value={item.url ?? ""} />

            <div className="flex items-start gap-4">
              <CertBadge variant={item.badge} className="h-12 w-12 shrink-0" />
              <div className="flex-1 grid gap-3 lg:grid-cols-2">
                <label className="block text-sm lg:col-span-2">
                  <span className="font-medium text-text-primary">Título</span>
                  <input value={item.title} onChange={(e) => updateItem(index, { title: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-text-primary">Meta</span>
                  <input value={item.meta} onChange={(e) => updateItem(index, { meta: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-text-primary">Badge</span>
                  <select value={item.badge} onChange={(e) => updateItem(index, { badge: e.target.value as AchievementItem["badge"] })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                    {ACHIEVEMENT_BADGE_ORDER.map((badge) => (
                      <option key={badge} value={badge}>{ACHIEVEMENT_BADGE_LABELS[badge]}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm lg:col-span-2">
                  <span className="font-medium text-text-primary">URL (opcional)</span>
                  <input value={item.url ?? ""} onChange={(e) => updateItem(index, { url: e.target.value || undefined })} type="url" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => moveItem(index, -1)} className="btn-secondary text-sm px-3 min-h-9" disabled={index === 0}>↑</button>
              <button type="button" onClick={() => moveItem(index, 1)} className="btn-secondary text-sm px-3 min-h-9" disabled={index === items.length - 1}>↓</button>
              <button type="button" onClick={() => setItems((c) => c.filter((_, i) => i !== index))} className="btn-secondary text-sm px-3 min-h-9 text-red-400" disabled={items.length === 1}>Eliminar</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setItems((c) => [...c, { title: "", meta: "", badge: "degree" }])} className="btn-secondary text-sm px-4 min-h-10">Añadir certificación</button>
      </fieldset>

      <button type="submit" className="btn-primary text-sm px-5 min-h-10" disabled={pending}>
        {pending ? "Guardando…" : "Guardar certificaciones"}
      </button>
    </form>
  );
}
