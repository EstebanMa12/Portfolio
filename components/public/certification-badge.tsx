import { CertBadge } from "@/components/public/cert-badge";
import { TechnologyIcon } from "@/components/ui/technology-icon";
import type { AchievementItem } from "@/lib/schemas/page-content";

type CertificationBadgeProps = {
  item: Pick<AchievementItem, "badge" | "imageUrl">;
  className?: string;
};

export function CertificationBadge({
  item,
  className = "cert-badge",
}: Readonly<CertificationBadgeProps>) {
  if (item.imageUrl) {
    return (
      <TechnologyIcon
        src={item.imageUrl}
        width={96}
        height={96}
        className={className}
      />
    );
  }

  return <CertBadge variant={item.badge} className={className} />;
}
