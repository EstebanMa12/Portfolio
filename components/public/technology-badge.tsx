import { TechnologyIcon } from "@/components/ui/technology-icon";
import { cn } from "@/lib/utils/cn";
import type { Technology } from "@/lib/schemas/technology";

function getTechInitials(name: string): string {
  return name
    .split(/[\s./]+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type TechnologyBadgeProps = {
  tech: Pick<Technology, "id" | "name" | "iconUrl">;
  className?: string;
};

export function TechnologyBadge({ tech, className }: Readonly<TechnologyBadgeProps>) {
  const initials = getTechInitials(tech.name);

  return (
    <span className={cn("badge inline-flex items-center gap-1.5", className)}>
      <span className="tech-badge-icon" aria-hidden="true">
        {tech.iconUrl ? (
          <TechnologyIcon
            src={tech.iconUrl}
            width={14}
            height={14}
            className="w-3.5 h-3.5"
          />
        ) : (
          <span className="text-[10px] font-semibold leading-none">{initials}</span>
        )}
      </span>
      {tech.name}
    </span>
  );
}
