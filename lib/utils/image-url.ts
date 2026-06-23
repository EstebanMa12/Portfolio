export function isSupabaseStorageUrl(url: string): boolean {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return false;

  try {
    const supabaseHost = new URL(baseUrl).hostname;
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === supabaseHost &&
      parsed.pathname.startsWith("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
