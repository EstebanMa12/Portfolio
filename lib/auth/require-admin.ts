import { redirect } from "next/navigation";
import { AuthError } from "@/lib/auth/errors";
import { isWhitelistedAdmin } from "@/lib/auth/is-whitelisted-admin";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
};

export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return admin;
}

export async function getOptionalAdmin(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const whitelisted = await isWhitelistedAdmin(supabase, user.id);
  if (!whitelisted) return null;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("id", user.id)
    .maybeSingle();

  return admin ?? null;
}

export function assertAdmin(user: AdminUser | null): asserts user is AdminUser {
  if (!user) {
    throw new AuthError("UNAUTHENTICATED");
  }
}
