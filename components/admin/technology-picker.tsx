"use client";

import type { Technology } from "@/lib/schemas/technology";

type TechnologyPickerProps = {
  technologies: Technology[];
  selectedIds: string[];
  name?: string;
};

export function TechnologyPicker({
  technologies,
  selectedIds,
  name = "technologyIds",
}: TechnologyPickerProps) {
  if (technologies.length === 0) {
    return <p className="text-sm text-text-muted">No hay tecnologías registradas.</p>;
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-text-primary mb-2">Stack</legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {technologies.map((tech) => (
          <label
            key={tech.id}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary cursor-pointer hover:border-accent/40"
          >
            <input
              type="checkbox"
              name={name}
              value={tech.id}
              defaultChecked={selectedIds.includes(tech.id)}
              className="accent-accent"
            />
            <span>{tech.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
