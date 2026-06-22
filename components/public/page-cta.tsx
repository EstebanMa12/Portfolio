import { CtaButton } from "@/components/analytics/cta-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

type PageCtaProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function PageCta({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: Readonly<PageCtaProps>) {
  return (
    <RevealOnScroll>
      <section
        aria-labelledby="page-cta-heading"
        className="mt-section-gap-mobile md:mt-section-gap"
      >
        <div className="card text-center py-10 px-6">
          <h2
            id="page-cta-heading"
            className="font-display text-xl md:text-2xl font-semibold text-text-primary mb-3"
          >
            {title}
          </h2>
          <p className="text-text-secondary text-sm max-w-prose mx-auto mb-6">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <CtaButton href={primaryHref} eventType="primary">
              {primaryLabel}
            </CtaButton>
            <CtaButton href={secondaryHref} variant="secondary" eventType="secondary">
              {secondaryLabel}
            </CtaButton>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}
