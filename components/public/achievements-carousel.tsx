import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { CertificationBadge } from "@/components/public/certification-badge";
import { SectionLabel } from "@/components/public/section-label";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type {
  AchievementItem,
  AchievementsContent,
} from "@/lib/schemas/page-content";

type AchievementsCarouselProps = {
  content: AchievementsContent;
};

type CertCardProps = {
  item: AchievementItem;
  index: number;
  viewCredentialLabel: string;
};

function CertCardBody({ item }: Readonly<{ item: AchievementItem }>) {
  return (
    <>
      <div>
        <h3 className="cert-card-title">{item.title}</h3>
        <p className="cert-card-meta">{item.meta}</p>
      </div>
      <CertificationBadge item={item} />
    </>
  );
}

function CertCard({ item, index, viewCredentialLabel }: Readonly<CertCardProps>) {
  const style = { zIndex: index + 1 } as const;
  const ariaLabel = `${item.title} — ${viewCredentialLabel}`;

  if (item.url) {
    const isExternal = item.url.startsWith("http");

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

export async function AchievementsCarousel({
  content,
}: Readonly<AchievementsCarouselProps>) {
  const t = await getTranslations("achievements");
  const tA11y = await getTranslations("a11y");

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
        aria-label={tA11y("certCarousel")}
      >
        <ul className="cert-stack">
          {content.items.map((item, index) => (
            <CertCard
              key={`${item.title}-${item.meta}`}
              item={item}
              index={index}
              viewCredentialLabel={t("viewCredential")}
            />
          ))}
        </ul>
      </div>

      <p className="text-text-muted text-xs mt-2">{t("carouselHint")}</p>
    </section>
  );
}
