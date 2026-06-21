import type { Metadata } from "next";
import Link from "next/link";
import { getLoginErrorMessage } from "@/lib/auth/errors";
import { LoginButton } from "./login-button";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = getLoginErrorMessage(params.error);
  const nextPath =
    params.next?.startsWith("/admin") && params.next !== "/admin/login"
      ? params.next
      : "/admin";

  return (
    <main className="min-h-screen flex items-center justify-center px-gutter py-16 bg-bg">
      <div className="w-full max-w-md card py-8 px-6 md:px-8">
        <p className="section-label mb-3">Administración</p>
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          Acceso restringido. Solo cuentas autorizadas en la whitelist pueden
          entrar al CMS.
        </p>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-8">
          <LoginButton nextPath={nextPath} />
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">
            ← Volver al portafolio
          </Link>
        </p>
      </div>
    </main>
  );
}
