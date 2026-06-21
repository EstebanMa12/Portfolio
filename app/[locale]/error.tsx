"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/public/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-gutter py-24 text-center">
      <p className="section-label mb-3">{t("label")}</p>
      <h1 className="font-display text-3xl font-semibold text-text-primary">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-text-secondary">{t("description")}</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button type="button" onClick={reset}>
          {t("retry")}
        </Button>
        <Button href="/" variant="secondary">
          {t("backHome")}
        </Button>
      </div>
    </main>
  );
}
