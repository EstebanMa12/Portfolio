import { getTranslations } from "next-intl/server";
import { Button } from "@/components/public/button";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-gutter py-24 text-center">
      <p className="section-label mb-3">404</p>
      <h1 className="font-display text-3xl font-semibold text-text-primary">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-text-secondary">{t("description")}</p>
      <Button href="/" variant="secondary" className="mt-8">
        {t("backHome")}
      </Button>
    </main>
  );
}
