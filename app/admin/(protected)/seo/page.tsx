import { LocaleSwitcher, SeoSettingsForm } from "@/components/admin/seo-settings-form";
import { SectionLabel } from "@/components/public/section-label";
import { localeSchema } from "@/lib/schemas/locale";
import { defaultLocale } from "@/lib/i18n/config";
import * as seoRepo from "@/lib/repositories/seo-repo";

type SeoAdminPageProps = {
  searchParams: Promise<{ locale?: string }>;
};

export default async function AdminSeoPage({ searchParams }: SeoAdminPageProps) {
  const { locale: localeParam } = await searchParams;
  const locale = localeSchema.catch(defaultLocale).parse(localeParam ?? defaultLocale);
  const settings = await seoRepo.getSettings(locale);

  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-2">
        SEO global
      </h1>
      <p className="text-sm text-text-secondary mb-4">
        Configuración por defecto del sitio ({locale.toUpperCase()}).
      </p>
      <LocaleSwitcher locale={locale} basePath="/admin/seo" />
      <SeoSettingsForm settings={settings} locale={locale} />
    </>
  );
}
