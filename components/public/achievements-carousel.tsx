import Link from "next/link";
import { CertBadge } from "@/components/public/cert-badge";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type {
  AchievementItem,
  AchievementsContent,
} from "@/lib/schemas/page-content";

type AchievementsCarouselProps = {
  content: AchievementsContent;
};

function CertCardBody({ item }: { item: AchievementItem }) {
  return (
    <>
      <div>
        <h3 className="cert-card-title">{item.title}</h3>
        <p className="cert-card-meta">{item.meta}</p>
      </div>
      <CertBadge variant={item.badge} />
    </>
  );
}

function CertCard({ item, index }: { item: AchievementItem; index: number }) {
  const style = { zIndex: index + 1 } as const;

  if (item.url) {
    const isExternal = item.url.startsWith("http");
    const ariaLabel = `${item.title} — ver credencial`;

    if (isExternal) {
      return (
        <li style={style}>
          <a
            href={item.url}
            className="cert-card block no-underline"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
          >
            <CertCardBody item={item} />
          </a>
        </li>
      );
    }

    return (
      <li style={style}>
        <Link href={item.url} className="cert-card block no-underline" aria-label={ariaLabel}>
          <CertCardBody item={item} />
        </Link>
      </li>
    );
  }

  return (
    <li style={style}>
      <article className="cert-card">
        <CertCardBody item={item} />
      </article>
    </li>
  );
}

export function AchievementsCarousel({ content }: AchievementsCarouselProps) {
  if (content.items.length === 0) return null;

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="mb-section-gap-mobile md:mb-section-gap scroll-mt-28"
    >
      <RevealOnScroll>
        <SectionLabel className="mb-3">{content.label}</SectionLabel>
        <h2
          id="achievements-heading"
          className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-10"
        >
          {content.title}
        </h2>
      </RevealOnScroll>

      <div
        className="cert-stack-wrap"
        tabIndex={0}
        aria-label="Carrusel de certificaciones. Desliza horizontalmente para ver más."
      >
        <ul className="cert-stack" role="list">
          {content.items.map((item, index) => (
            <CertCard key={`${item.title}-${item.meta}`} item={item} index={index} />
          ))}
        </ul>
      </div>

      <p className="text-text-muted text-xs mt-2">
        Desliza horizontalmente para explorar · Hover para destacar
      </p>
    </section>
  );
}
