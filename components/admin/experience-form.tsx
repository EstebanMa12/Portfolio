"use client";

import Link from "next/link";
import { useActionState, useCallback, useState } from "react";
import {
  createExperience,
  deleteExperience,
  updateExperience,
  type ActionState,
} from "@/app/admin/experience/actions";
import { TechnologyPicker } from "@/components/admin/technology-picker";
import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";
import type { Technology } from "@/lib/schemas/technology";

type ExperienceFormProps = {
  experience?: ExperienceWithTechnologies;
  technologies: Technology[];
};

const initialState: ActionState = {};

export function ExperienceForm({ experience, technologies }: ExperienceFormProps) {
  const isEdit = Boolean(experience);
  const [bullets, setBullets] = useState<string[]>(
    experience?.bullets.length ? experience.bullets : [""],
  );

  const boundUpdate = useCallback(
    (prev: ActionState, formData: FormData) => {
      if (!experience) {
        return { error: "Experiencia no encontrada." };
      }
      return updateExperience(experience.id, prev, formData);
    },
    [experience],
  );

  const [createState, createAction, createPending] = useActionState(
    createExperience,
    initialState,
  );
  const [updateState, updateAction, updatePending] = useActionState(
    boundUpdate,
    initialState,
  );

  const state = isEdit ? updateState : createState;
  const pending = isEdit ? updatePending : createPending;

  const addBullet = () => setBullets((current) => [...current, ""]);
  const removeBullet = (index: number) => {
    setBullets((current) => current.filter((_, i) => i !== index));
  };
  const updateBullet = (index: number, value: string) => {
    setBullets((current) => current.map((bullet, i) => (i === index ? value : bullet)));
  };

  return (
    <>
      <form action={isEdit ? updateAction : createAction} className="space-y-8">
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
            <span className="font-medium text-text-primary">Empresa</span>
            <input
              name="company"
              required
              defaultValue={experience?.company}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Rol</span>
            <input
              name="role"
              required
              defaultValue={experience?.role}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Fecha inicio</span>
            <input
              name="startDate"
              type="month"
              required
              defaultValue={toMonthInput(experience?.startDate)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Fecha fin</span>
            <input
              name="endDate"
              type="month"
              defaultValue={toMonthInput(experience?.endDate)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
            <span className="mt-1 block text-xs text-text-muted">
              Dejar vacío si es el puesto actual.
            </span>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-text-primary">Orden</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={experience?.sortOrder ?? 0}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            />
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-text-primary mb-2">
            Logros / responsabilidades
          </legend>
          {bullets.map((bullet, index) => (
            <div key={index} className="flex gap-2">
              <input
                name="bullets"
                value={bullet}
                onChange={(event) => updateBullet(index, event.target.value)}
                placeholder="Describe un logro o responsabilidad"
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
              />
              <button
                type="button"
                onClick={() => removeBullet(index)}
                className="btn-secondary text-sm px-3 min-h-10"
                disabled={bullets.length === 1}
                aria-label="Eliminar bullet"
              >
                −
              </button>
            </div>
          ))}
          <button type="button" onClick={addBullet} className="btn-secondary text-sm px-4 min-h-10">
            Añadir bullet
          </button>
        </fieldset>

        <TechnologyPicker
          technologies={technologies}
          selectedIds={experience?.technologies.map((tech) => tech.id) ?? []}
        />

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
          <button
            type="submit"
            className="btn-primary text-sm px-5 min-h-10"
            disabled={pending}
          >
            {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear experiencia"}
          </button>

          {!isEdit ? (
            <Link href="/admin/experience" className="btn-secondary text-sm px-5 min-h-10">
              Cancelar
            </Link>
          ) : null}
        </div>
      </form>

      {isEdit && experience ? (
        <div className="mt-4">
          <form action={deleteExperience.bind(null, experience.id)}>
            <button
              type="submit"
              className="btn-secondary text-sm px-5 min-h-10 text-red-400"
              onClick={(event) => {
                if (!window.confirm("¿Eliminar esta experiencia permanentemente?")) {
                  event.preventDefault();
                }
              }}
            >
              Eliminar
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

function toMonthInput(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 7);
}
