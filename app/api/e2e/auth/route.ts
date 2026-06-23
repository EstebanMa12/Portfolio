import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function isE2EEnabled(): boolean {
  return Boolean(
    process.env.E2E_TEST_SECRET &&
      process.env.E2E_ADMIN_EMAIL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function POST(request: Request) {
  if (!isE2EEnabled()) {
    return NextResponse.json({ error: "E2E not configured" }, { status: 404 });
  }

  if (request.headers.get("x-e2e-secret") !== process.env.E2E_TEST_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const email = process.env.E2E_ADMIN_EMAIL!;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  const hashedToken = linkData?.properties?.hashed_token;
  if (linkError || !hashedToken) {
    return NextResponse.json(
      { error: linkError?.message ?? "Failed to generate auth link" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: hashedToken,
    type: "email",
  });

  if (verifyError || !sessionData.user) {
    return NextResponse.json(
      { error: verifyError?.message ?? "Failed to verify session" },
      { status: 500 },
    );
  }

  const { error: whitelistError } = await admin.from("admin_users").upsert({
    id: sessionData.user.id,
    email: sessionData.user.email ?? email,
  });

  if (whitelistError) {
    return NextResponse.json({ error: whitelistError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userId: sessionData.user.id });
}
