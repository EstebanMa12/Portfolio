"use client";

import Image from "next/image";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import type { ProjectWithTechnologies } from "@/lib/schemas/project";

type ProjectsTableProps = {
  projects: ProjectWithTechnologies[];
  emptyMessage?: string;
};

export function ProjectsTable({
  projects,
  emptyMessage = "No hay proyectos todavía.",
}: ProjectsTableProps) {
  const columns = useMemo<ColumnDef<ProjectWithTechnologies>[]>(
    () => [
      {
        id: "thumbnail",
        header: "Miniatura",
        enableSorting: false,
        cell: ({ row }) => {
          const thumbnail = row.original.images[0]?.imageUrl;
          return thumbnail ? (
            <div className="relative h-10 w-16 overflow-hidden rounded border border-border">
              <Image
                src={thumbnail}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <span className="text-text-muted">—</span>
          );
        },
      },
      {
        accessorKey: "title",
        header: "Título",
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "Categoría",
        cell: ({ row }) => (
          <span className="text-text-secondary">{row.original.category}</span>
        ),
      },
      {
        accessorKey: "locale",
        header: "Locale",
        cell: ({ row }) => (
          <span className="uppercase text-text-secondary">{row.original.locale}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
          <span
            className={
              row.original.status === "published" ? "text-accent" : "text-text-muted"
            }
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "featured",
        header: "Destacado",
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {row.original.featured ? "Sí" : "No"}
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
            href={`/admin/projects/${row.original.id}`}
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
      data={projects}
      columns={columns}
      searchPlaceholder="Título, categoría o locale…"
      initialSorting={[{ id: "sortOrder", desc: false }]}
      emptyMessage={emptyMessage}
      globalFilterFn={(row, _columnId, filterValue) => {
        const query = String(filterValue).toLowerCase().trim();
        if (!query) return true;

        const project = row.original;
        return (
          project.title.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.locale.toLowerCase().includes(query) ||
          project.status.toLowerCase().includes(query)
        );
      }}
    />
  );
}
