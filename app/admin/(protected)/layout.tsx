import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { signOut } from "@/app/admin/login/actions";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-gutter h-14 flex items-center justify-between gap-4">
          <Link
            href="/admin"
            className="font-display text-sm font-semibold text-text-primary"
          >
            Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-text-muted">
              {admin.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="btn-secondary text-sm px-4 min-h-10"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-gutter py-8">
        <AdminNav />
        {children}
      </main>
    </div>
  );
}
