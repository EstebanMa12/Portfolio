import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SectionLabel } from "@/components/public/section-label";
import { cn } from "@/lib/utils/cn";

type PageHeaderProps = {
  label: string;
  title: string;
  description?: string;
  headingId?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function PageHeader({
  label,
  title,
  description,
  headingId,
  className,
  titleClassName,
  descriptionClassName,
}: Readonly<PageHeaderProps>) {
  return (
    <RevealOnScroll className={cn("mb-10", className)}>
      <SectionLabel className="mb-3">{label}</SectionLabel>
      <h1
        id={headingId}
        className={cn(
          "font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary",
          titleClassName,
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-3 text-text-secondary max-w-prose leading-relaxed",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </RevealOnScroll>
  );
}
