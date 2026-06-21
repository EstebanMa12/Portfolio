import type { PostgrestError } from "@supabase/supabase-js";

export type RepositoryErrorCode =
  | "NOT_FOUND"
  | "QUERY_FAILED"
  | "VALIDATION_FAILED";

export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(
    message: string,
    code: RepositoryErrorCode,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "RepositoryError";
    this.code = code;
  }
}

type SupabaseResult<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export function unwrap<T>(
  result: SupabaseResult<T>,
  notFoundMessage = "Resource not found",
): NonNullable<T> {
  if (result.error) {
    throw new RepositoryError(result.error.message, "QUERY_FAILED", result.error);
  }
  if (result.data === null) {
    throw new RepositoryError(notFoundMessage, "NOT_FOUND");
  }
  return result.data as NonNullable<T>;
}

export function unwrapOptional<T>(result: SupabaseResult<T>): T | null {
  if (result.error) {
    throw new RepositoryError(result.error.message, "QUERY_FAILED", result.error);
  }
  return result.data;
}

export function assertNoError(result: { error: PostgrestError | null }): void {
  if (result.error) {
    throw new RepositoryError(result.error.message, "QUERY_FAILED", result.error);
  }
}

/**
 * Wrap repository reads with React cache() for per-request deduplication.
 *
 * @example
 * export const getHero = cache(async () => pageContentRepo.getById("hero"));
 */
export { cache as cachedQuery } from "react";
