"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { ActionResult } from "@/lib/types/actions";

/**
 * Example guarded action — use requireAdmin() at the start of every admin mutation.
 */
export async function pingAdmin(): Promise<ActionResult<{ email: string }>> {
  const admin = await requireAdmin();
  return { success: true, data: { email: admin.email } };
}
