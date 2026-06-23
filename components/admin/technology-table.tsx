"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { TechnologyIcon } from "@/components/ui/technology-icon";
import type { Technology } from "@/lib/schemas/technology";
import { TECH_CATEGORY_LABELS } from "@/lib/utils/tech-categories";

type TechnologyTableProps = {
  technologies: Technology[];
  onEdit: (technology: Technology) => void;
  renderDeleteButton: (technology: Technology) => React.ReactNode;
};

export function TechnologyTable({
  technologies,
  onEdit,
  renderDeleteButton,
}: TechnologyTableProps) {
  const columns = useMemo<ColumnDef<Technology>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <span className="font-mono text-text-secondary">{row.original.slug}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "Categoría",
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {TECH_CATEGORY_LABELS[row.original.category]}
          </span>
        ),
      },
      {
        id: "icon",
        header: "Icono",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.iconUrl ? (
            <TechnologyIcon
              src={row.original.iconUrl}
              width={24}
              height={24}
              className="size-6"
            />
          ) : (
            <span className="text-text-muted">—</span>
          ),
      },
      {
        id: "actions",
        header: "Acciones",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onEdit(row.original)}
              className="text-accent hover:underline"
            >
              Editar
            </button>
            {renderDeleteButton(row.original)}
          </div>
        ),
      },
    ],
    [onEdit, renderDeleteButton],
  );

  return (
    <AdminDataTable
      data={technologies}
      columns={columns}
      searchPlaceholder="Nombre, slug o categoría…"
      initialSorting={[{ id: "name", desc: false }]}
      emptyMessage="No hay tecnologías registradas."
      globalFilterFn={(row, _columnId, filterValue) => {
        const query = String(filterValue).toLowerCase().trim();
        if (!query) return true;

        const tech = row.original;
        return (
          tech.name.toLowerCase().includes(query) ||
          tech.slug.toLowerCase().includes(query) ||
          TECH_CATEGORY_LABELS[tech.category].toLowerCase().includes(query)
        );
      }}
    />
  );
}
