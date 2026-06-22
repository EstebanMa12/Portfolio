import { CertBadge } from "@/components/public/cert-badge";
import { TechnologyIcon } from "@/components/ui/technology-icon";
import type { AchievementItem } from "@/lib/schemas/page-content";
import { cn } from "@/lib/utils/cn";

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
        className={cn(className, "size-full object-contain")}
      />
    );
  }

  return <CertBadge variant={item.badge} className={className} />;
}
