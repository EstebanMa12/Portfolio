import type { AchievementBadge } from "@/lib/schemas/page-content";

export const ACHIEVEMENT_BADGE_LABELS: Record<AchievementBadge, string> = {
  degree: "Titulación",
  aws: "AWS",
  terraform: "Terraform",
  kubernetes: "Kubernetes",
  award: "Premio",
  speaker: "Speaker",
  opensource: "Open Source",
};

export const ACHIEVEMENT_BADGE_ORDER: AchievementBadge[] = [
  "degree",
  "aws",
  "terraform",
  "kubernetes",
  "award",
  "speaker",
  "opensource",
];
