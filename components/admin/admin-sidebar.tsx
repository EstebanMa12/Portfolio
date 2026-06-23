"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  Briefcase,
  FileText,
  LayoutDashboard,
  Layers,
  Search,
  Settings2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/technologies", label: "Tecnologías", icon: Layers, exact: false },
  { href: "/admin/experience", label: "Experiencia", icon: Briefcase, exact: false },
  { href: "/admin/projects", label: "Proyectos", icon: FileText, exact: false },
  { href: "/admin/articles", label: "Artículos", icon: BookOpen, exact: false },
  { href: "/admin/certifications", label: "Certificaciones", icon: Award, exact: false },
  { href: "/admin/pages", label: "Páginas", icon: Settings2, exact: false },
  { href: "/admin/seo", label: "SEO", icon: Search, exact: false },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <LayoutDashboard />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-display font-semibold">Admin</span>
                  <span className="text-xs text-sidebar-foreground/70">CMS Portfolio</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Contenido</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const active = link.exact
                  ? pathname === link.href
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={link.label}>
                      <Link href={link.href}>
                        <link.icon />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
