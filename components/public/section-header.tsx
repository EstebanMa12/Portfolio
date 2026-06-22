import { Link } from "@/lib/i18n/navigation";
import { SectionLabel } from "@/components/public/section-label";
import { cn } from "@/lib/utils/cn";

type SectionHeaderBaseProps = {
  label: string;
  title: string;
  description?: string;
  className?: string;
};

type SectionHeaderProps = SectionHeaderBaseProps &
  (
    | { href?: undefined; linkLabel?: undefined }
    | { href: string; linkLabel: string }
  );

export function SectionHeader({
  label,
  title,
  description,
  href,
  linkLabel,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", className)}>
      <SectionLabel className="mb-3">{label}</SectionLabel>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
            {title}
          </h2>
          {description ? (
            <p className="text-text-secondary text-base mt-2 max-w-prose">
              {description}
            </p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="text-sm font-medium text-accent hover:text-text-primary transition-colors shrink-0"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
