"use client";

import { useActionState } from "react";
import { updateContactContent, type ActionState } from "@/app/admin/pages/actions";
import type { ContactContent } from "@/lib/schemas/page-content";
import type { Locale } from "@/lib/i18n/config";

type ContactFormProps = {
  content: ContactContent;
  locale: Locale;
};

const initialState: ActionState = {};

export function ContactForm({ content, locale }: ContactFormProps) {
  const [state, action, pending] = useActionState(updateContactContent, initialState);

  return (
    <form action={action} className="space-y-6">
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

      <label className="block text-sm">
        <span className="font-medium text-text-primary">Descripción</span>
        <textarea name="description" rows={3} required defaultValue={content.description} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-text-primary">Email</span>
        <input name="email" type="email" required defaultValue={content.email} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-text-primary">LinkedIn</span>
        <input name="linkedin" type="url" required defaultValue={content.linkedin} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-text-primary">GitHub</span>
        <input name="github" type="url" required defaultValue={content.github} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary" />
      </label>

      <button type="submit" className="btn-primary text-sm px-5 min-h-10" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
