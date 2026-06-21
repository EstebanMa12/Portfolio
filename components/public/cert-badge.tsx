import type { AchievementBadge } from "@/lib/schemas/page-content";

type CertBadgeProps = {
  variant: AchievementBadge;
  className?: string;
};

export function CertBadge({ variant, className = "cert-badge" }: CertBadgeProps) {
  switch (variant) {
    case "degree":
      return (
        <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
          <circle cx="48" cy="48" r="44" fill="var(--color-surface-raised)" />
          <circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            opacity="0.65"
          />
          <text
            x="48"
            y="52"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-sans), Inter, sans-serif"
          >
            B.S.
          </text>
        </svg>
      );
    case "aws":
      return (
        <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
          <rect x="8" y="8" width="80" height="80" rx="8" fill="#232f3e" />
          <text
            x="48"
            y="44"
            textAnchor="middle"
            fill="#ff9900"
            fontSize="22"
            fontWeight="700"
            fontFamily="var(--font-sans), Inter, sans-serif"
          >
            AWS
          </text>
          <text
            x="48"
            y="62"
            textAnchor="middle"
            fill="#fafafa"
            fontSize="9"
            fontFamily="var(--font-sans), Inter, sans-serif"
          >
            Solutions
          </text>
        </svg>
      );
    case "terraform":
      return (
        <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
          <path
            d="M48 6 L88 28 L88 68 L48 90 L8 68 L8 28 Z"
            fill="#1a1a1c"
          />
          <text
            x="48"
            y="50"
            textAnchor="middle"
            fill="#fafafa"
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font-sans), Inter, sans-serif"
          >
            TF
          </text>
          <text
            x="48"
            y="64"
            textAnchor="middle"
            fill="#7c3aed"
            fontSize="8"
            fontFamily="var(--font-sans), Inter, sans-serif"
          >
            ASSOCIATE
          </text>
        </svg>
      );
    case "kubernetes":
      return (
        <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
          <circle cx="48" cy="48" r="40" fill="#326ce5" />
          <polygon
            points="48,22 62,38 48,54 34,38"
            fill="#fafafa"
            opacity="0.9"
          />
          <polygon
            points="48,42 62,58 48,74 34,58"
            fill="#fafafa"
            opacity="0.7"
          />
        </svg>
      );
    case "award":
      return (
        <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
          <circle
            cx="48"
            cy="40"
            r="28"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <path d="M48 68 L42 82 L48 78 L54 82 Z" fill="#f59e0b" />
          <text
            x="48"
            y="46"
            textAnchor="middle"
            fill="#b45309"
            fontSize="20"
            fontFamily="var(--font-sans), Inter, sans-serif"
          >
            ★
          </text>
        </svg>
      );
    case "speaker":
      return (
        <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
          <rect x="12" y="20" width="72" height="56" rx="6" fill="var(--color-surface-raised)" />
          <circle cx="48" cy="44" r="14" fill="var(--color-accent)" opacity="0.35" />
          <rect x="28" y="62" width="40" height="4" rx="2" fill="var(--color-text-muted)" opacity="0.5" />
        </svg>
      );
    case "opensource":
      return (
        <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
          <circle cx="48" cy="48" r="40" fill="#27272a" />
          <path
            fill="#fafafa"
            d="M48 28c-11 0-20 9-20 20 0 8.8 5.7 16.3 13.6 19 .99.18 1.35-.43 1.35-.95 0-.47-.02-1.7-.03-3.34-5.55 1.2-6.72-2.67-6.72-2.67-.91-2.3-2.22-2.91-2.22-2.91-1.82-1.24.14-1.22.14-1.22 2 .14 3.06 2.06 3.06 2.06 1.78 3.05 4.67 2.17 5.81 1.66.18-1.29.7-2.17 1.27-2.67-4.43-.5-9.09-2.22-9.09-9.88 0-2.18.78-3.97 2.06-5.37-.21-.5-.89-2.54.2-5.29 0 0 1.68-.54 5.5 2.05a19.1 19.1 0 0110 0c3.82-2.59 5.5-2.05 5.5-2.05 1.09 2.75.41 4.79.2 5.29 1.28 1.4 2.06 3.19 2.06 5.37 0 7.68-4.67 9.37-9.12 9.86.72.62 1.35 1.83 1.35 3.69 0 2.67-.02 4.82-.02 5.48 0 .53.36 1.14 1.37.95A20 20 0 0068 48c0-11-9-20-20-20z"
          />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
          <circle cx="48" cy="48" r="40" fill="var(--color-surface-raised)" />
          <text
            x="48"
            y="52"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-sans), Inter, sans-serif"
          >
            ?
          </text>
        </svg>
      );
  }
}
