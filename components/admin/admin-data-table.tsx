"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type SortingState,
  type Table as ReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";

type AdminDataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchPlaceholder?: string;
  globalFilterFn?: FilterFn<TData>;
  emptyMessage?: string;
  emptySearchMessage?: string;
  initialSorting?: SortingState;
  enableSearch?: boolean;
};

export function AdminDataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Buscar…",
  globalFilterFn,
  emptyMessage = "No hay registros.",
  emptySearchMessage = "No hay resultados para la búsqueda.",
  initialSorting = [],
  enableSearch = true,
}: AdminDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
  });

  return (
    <div className="flex flex-col gap-4">
      {enableSearch ? (
        <label className="block max-w-sm text-sm">
          <span className="font-medium text-text-primary">Buscar</span>
          <input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          />
        </label>
      ) : null}

      <AdminDataTableBody
        table={table}
        columns={columns}
        data={data}
        emptyMessage={emptyMessage}
        emptySearchMessage={emptySearchMessage}
        hasFilter={Boolean(globalFilter.trim())}
      />
    </div>
  );
}

type AdminDataTableBodyProps<TData> = {
  table: ReactTable<TData>;
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyMessage: string;
  emptySearchMessage: string;
  hasFilter: boolean;
};

function AdminDataTableBody<TData>({
  table,
  columns,
  data,
  emptyMessage,
  emptySearchMessage,
  hasFilter,
}: AdminDataTableBodyProps<TData>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader className="bg-surface/80">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-4 py-3 text-text-muted">
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-1 font-medium",
                        header.column.getIsSorted() && "text-text-primary",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-4 py-8 text-center text-text-muted"
              >
                {data.length === 0
                  ? emptyMessage
                  : hasFilter
                    ? emptySearchMessage
                    : emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
