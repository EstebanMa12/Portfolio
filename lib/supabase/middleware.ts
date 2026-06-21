import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isWhitelistedAdmin } from "@/lib/auth/is-whitelisted-admin";
import type { Database } from "@/types/database";

function applyNoIndexHeader(response: NextResponse): void {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    (process.env.VERCEL_ENV === undefined && process.env.NODE_ENV === "production");

  if (!isProduction) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set({ name, value });
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      const response = NextResponse.redirect(loginUrl);
      applyNoIndexHeader(response);
      return response;
    }

    const whitelisted = await isWhitelistedAdmin(supabase, user.id);
    if (!whitelisted) {
      await supabase.auth.signOut();
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("error", "unauthorized");
      const response = NextResponse.redirect(loginUrl);
      applyNoIndexHeader(response);
      return response;
    }
  }

  if (isLoginRoute && user) {
    const whitelisted = await isWhitelistedAdmin(supabase, user.id);
    if (whitelisted) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin";
      adminUrl.search = "";
      const response = NextResponse.redirect(adminUrl);
      applyNoIndexHeader(response);
      return response;
    }
  }

  applyNoIndexHeader(supabaseResponse);
  return supabaseResponse;
}
