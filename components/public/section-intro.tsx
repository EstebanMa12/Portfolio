import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SectionLabel } from "@/components/public/section-label";
import { cn } from "@/lib/utils/cn";

type SectionIntroProps = {
  label: string;
  title: string;
  description?: string;
  headingId?: string;
  className?: string;
};

export function SectionIntro({
  label,
  title,
  description,
  headingId,
  className,
}: Readonly<SectionIntroProps>) {
  return (
    <RevealOnScroll className={cn("mb-10", className)}>
      <SectionLabel className="mb-3">{label}</SectionLabel>
      <h2
        id={headingId}
        className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-4"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-text-secondary text-base leading-relaxed max-w-prose">
          {description}
        </p>
      ) : null}
    </RevealOnScroll>
  );
}
