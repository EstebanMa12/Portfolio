import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export type ProjectStatusFilter = "all" | "draft" | "published";

const options: Array<{ value: ProjectStatusFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "draft", label: "Borradores" },
  { value: "published", label: "Publicados" },
];

type ProjectStatusFilterProps = {
  current: ProjectStatusFilter;
};

export function ProjectStatusFilterBar({ current }: ProjectStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filtrar por estado">
      {options.map((option) => {
        const active = current === option.value;
        const href =
          option.value === "all"
            ? "/admin/projects"
            : `/admin/projects?status=${option.value}`;

        return (
          <Link
            key={option.value}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent/15 text-accent"
                : "text-text-secondary hover:text-text-primary hover:bg-surface",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
