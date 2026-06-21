import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("a11y");

  return (
    <a className="sr-only" href="#main">
      {t("skipToContent")}
    </a>
  );
}
