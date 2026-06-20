/**
 * Converts a title into a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Appends a numeric suffix when the base slug already exists.
 */
export function withCollisionSuffix(baseSlug: string, attempt: number): string {
  return attempt <= 1 ? baseSlug : `${baseSlug}-${attempt}`;
}
