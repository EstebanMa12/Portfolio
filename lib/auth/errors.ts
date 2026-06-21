export class AuthError extends Error {
  constructor(
    readonly code: "UNAUTHENTICATED" | "UNAUTHORIZED",
    message?: string,
  ) {
    super(message ?? code);
    this.name = "AuthError";
  }
}

export const LOGIN_ERRORS = {
  unauthorized:
    "Tu cuenta de GitHub no está autorizada para acceder al panel de administración.",
  auth: "No se pudo completar el inicio de sesión. Intenta de nuevo.",
} as const;

export type LoginErrorCode = keyof typeof LOGIN_ERRORS;

export function getLoginErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  if (code in LOGIN_ERRORS) {
    return LOGIN_ERRORS[code as LoginErrorCode];
  }
  return LOGIN_ERRORS.auth;
}
