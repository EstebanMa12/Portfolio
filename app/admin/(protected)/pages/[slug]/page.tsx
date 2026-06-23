import { notFound } from "next/navigation";
import { AboutForm } from "@/components/admin/about-form";
import { ContactForm } from "@/components/admin/contact-form";
import { HeroForm, LocaleSwitcher } from "@/components/admin/hero-form";
import { SectionLabel } from "@/components/public/section-label";
import { localeSchema } from "@/lib/schemas/locale";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import * as pageContentRepo from "@/lib/repositories/page-content-repo";

type PageEditorProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
};

export default async function AdminPageEditorPage({
  params,
  searchParams,
}: PageEditorProps) {
  const { slug } = await params;
  const { locale: localeParam } = await searchParams;
  const locale = localeSchema.catch(defaultLocale).parse(localeParam ?? defaultLocale);

  if (slug === "hero") {
    const content = await pageContentRepo.getByIdAdmin("hero", locale);
    if (!content) notFound();
    return (
      <PageShell title="Hero" locale={locale}>
        <HeroForm content={content} locale={locale} />
      </PageShell>
    );
  }

  if (slug === "about") {
    const content = await pageContentRepo.getByIdAdmin("about", locale);
    if (!content) notFound();
    return (
      <PageShell title="About" locale={locale}>
        <AboutForm content={content} locale={locale} />
      </PageShell>
    );
  }

  if (slug === "contact") {
    const content = await pageContentRepo.getByIdAdmin("contact", locale);
    if (!content) notFound();
    return (
      <PageShell title="Contact" locale={locale}>
        <ContactForm content={content} locale={locale} />
      </PageShell>
    );
  }

  notFound();
}

function PageShell({
  title,
  locale,
  children,
}: {
  title: string;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-2">
        Editar {title}
      </h1>
      <p className="text-sm text-text-secondary mb-4">Locale: {locale.toUpperCase()}</p>
      <LocaleSwitcher locale={locale} />
      {children}
    </>
  );
}
