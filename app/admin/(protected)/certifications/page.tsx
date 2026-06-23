import { notFound } from "next/navigation";
import { CertificationsForm } from "@/components/admin/certifications-form";
import { LocaleSwitcher } from "@/components/admin/seo-settings-form";
import { SectionLabel } from "@/components/public/section-label";
import { localeSchema } from "@/lib/schemas/locale";
import { defaultLocale } from "@/lib/i18n/config";
import * as pageContentRepo from "@/lib/repositories/page-content-repo";

type CertificationsPageProps = {
  searchParams: Promise<{ locale?: string }>;
};

export default async function AdminCertificationsPage({
  searchParams,
}: CertificationsPageProps) {
  const { locale: localeParam } = await searchParams;
  const locale = localeSchema.catch(defaultLocale).parse(localeParam ?? defaultLocale);
  const content = await pageContentRepo.getByIdAdmin("achievements", locale);

  if (!content) notFound();

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-2">
        Certificaciones
      </h1>
      <p className="text-sm text-text-secondary mb-4">
        Carrusel de credenciales en home ({locale.toUpperCase()}).
      </p>
      <LocaleSwitcher locale={locale} basePath="/admin/certifications" />
      <CertificationsForm content={content} locale={locale} />
    </>
  );
}
