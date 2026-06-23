"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import type { ExperienceWithTechnologies } from "@/lib/schemas/experience";

type ExperienceTableProps = {
  experiences: ExperienceWithTechnologies[];
};

function formatPeriod(startDate: string, endDate: string | null): string {
  const start = startDate.slice(0, 7);
  const end = endDate ? endDate.slice(0, 7) : "actual";
  return `${start} → ${end}`;
}

export function ExperienceTable({ experiences }: ExperienceTableProps) {
  const columns = useMemo<ColumnDef<ExperienceWithTechnologies>[]>(
    () => [
      {
        accessorKey: "company",
        header: "Empresa",
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">{row.original.company}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Rol",
        cell: ({ row }) => (
          <span className="text-text-secondary">{row.original.role}</span>
        ),
      },
      {
        id: "period",
        header: "Periodo",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-text-secondary">
            {formatPeriod(row.original.startDate, row.original.endDate)}
          </span>
        ),
      },
      {
        id: "stack",
        header: "Stack",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {row.original.technologies.length > 0
              ? row.original.technologies.map((tech) => tech.name).join(", ")
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "sortOrder",
        header: "Orden",
        cell: ({ row }) => (
          <span className="text-text-secondary">{row.original.sortOrder}</span>
        ),
      },
      {
        id: "actions",
        header: "Acciones",
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            href={`/admin/experience/${row.original.id}`}
            className="text-accent hover:underline"
          >
            Editar
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <AdminDataTable
      data={experiences}
      columns={columns}
      searchPlaceholder="Empresa, rol o tecnología…"
      initialSorting={[{ id: "sortOrder", desc: false }]}
      emptyMessage="No hay experiencias registradas."
      globalFilterFn={(row, _columnId, filterValue) => {
        const query = String(filterValue).toLowerCase().trim();
        if (!query) return true;

        const experience = row.original;
        return (
          experience.company.toLowerCase().includes(query) ||
          experience.role.toLowerCase().includes(query) ||
          experience.technologies.some((tech) =>
            tech.name.toLowerCase().includes(query),
          )
        );
      }}
    />
  );
}
