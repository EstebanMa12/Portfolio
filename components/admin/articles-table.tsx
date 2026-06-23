"use client";

import Image from "next/image";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import type { Article } from "@/lib/schemas/article";

type ArticlesTableProps = {
  articles: Article[];
};

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const columns = useMemo<ColumnDef<Article>[]>(
    () => [
      {
        id: "cover",
        header: "Portada",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.coverImageUrl ? (
            <div className="relative h-10 w-16 overflow-hidden rounded border border-border">
              <Image
                src={row.original.coverImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <span className="text-text-muted">—</span>
          ),
      },
      {
        accessorKey: "title",
        header: "Título",
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">{row.original.title}</span>
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
        accessorKey: "publishedAt",
        header: "Publicado",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-text-secondary">
            {row.original.publishedAt
              ? new Date(row.original.publishedAt).toLocaleDateString("es-ES")
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "readingTimeMin",
        header: "Lectura",
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {row.original.readingTimeMin
              ? `${row.original.readingTimeMin} min`
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Acciones",
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            href={`/admin/articles/${row.original.id}`}
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
      data={articles}
      columns={columns}
      searchPlaceholder="Título, locale o estado…"
      initialSorting={[{ id: "publishedAt", desc: true }]}
      emptyMessage="No hay artículos todavía."
      globalFilterFn={(row, _columnId, filterValue) => {
        const query = String(filterValue).toLowerCase().trim();
        if (!query) return true;

        const article = row.original;
        return (
          article.title.toLowerCase().includes(query) ||
          article.locale.toLowerCase().includes(query) ||
          article.status.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }}
    />
  );
}
