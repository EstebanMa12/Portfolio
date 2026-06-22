import { TextLink } from "@/components/public/text-link";
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
          <TextLink href={href} className="shrink-0">
            {linkLabel}
          </TextLink>
        ) : null}
      </div>
    </div>
  );
}
