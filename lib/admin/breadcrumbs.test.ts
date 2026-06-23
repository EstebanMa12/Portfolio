import { describe, expect, it } from "vitest";
import { getAdminBreadcrumbs } from "@/lib/admin/breadcrumbs";

describe("getAdminBreadcrumbs", () => {
  it("returns dashboard on root admin route", () => {
    expect(getAdminBreadcrumbs("/admin")).toEqual([{ label: "Dashboard" }]);
  });

  it("returns section list breadcrumb", () => {
    expect(getAdminBreadcrumbs("/admin/projects")).toEqual([
      { label: "Admin", href: "/admin" },
      { label: "Proyectos" },
    ]);
  });

  it("returns new entity breadcrumb", () => {
    expect(getAdminBreadcrumbs("/admin/projects/new")).toEqual([
      { label: "Admin", href: "/admin" },
      { label: "Proyectos", href: "/admin/projects" },
      { label: "Nuevo proyecto" },
    ]);
  });

  it("returns edit entity breadcrumb for uuid routes", () => {
    expect(
      getAdminBreadcrumbs("/admin/articles/550e8400-e29b-41d4-a716-446655440000"),
    ).toEqual([
      { label: "Admin", href: "/admin" },
      { label: "Artículos", href: "/admin/articles" },
      { label: "Editar artículo" },
    ]);
  });

  it("returns page editor breadcrumb", () => {
    expect(getAdminBreadcrumbs("/admin/pages/hero")).toEqual([
      { label: "Admin", href: "/admin" },
      { label: "Páginas", href: "/admin/pages" },
      { label: "Hero" },
    ]);
  });
});
