import { SectionLabel } from "@/components/public/section-label";
import { PLACEHOLDER_PAGES } from "@/lib/config/site";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";

type PlaceholderPageProps = {
  path: keyof typeof PLACEHOLDER_PAGES;
};

export async function generatePlaceholderMetadata(path: PlaceholderPageProps["path"]) {
  return createPageMetadata(path);
}

export function PlaceholderPage({ path }: PlaceholderPageProps) {
  const page = PLACEHOLDER_PAGES[path];

  return (
    <section aria-labelledby="page-heading" className="py-12">
      <SectionLabel className="mb-3">Próximamente</SectionLabel>
      <h1
        id="page-heading"
        className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary"
      >
        {page.title}
      </h1>
      <p className="mt-4 max-w-prose text-text-secondary leading-relaxed">
        {page.description} Esta sección estará disponible pronto.
      </p>
    </section>
  );
}
