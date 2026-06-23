"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeaderActions } from "@/components/admin/admin-header-actions";

type AdminShellProps = {
  children: React.ReactNode;
  email: string;
};

export function AdminShell({ children, email }: AdminShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
              <AdminBreadcrumbs />
              <AdminHeaderActions email={email} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
