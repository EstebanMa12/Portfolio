import { track as vercelTrack } from "@vercel/analytics";

export type CtaEventType =
  | "primary"
  | "secondary"
  | "cv"
  | "github"
  | "linkedin"
  | "email"
  | "projects"
  | "contact"
  | "experience";

export function trackCtaClick(type: CtaEventType, page: string) {
  vercelTrack("cta_click", { type, page });
}
