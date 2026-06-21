import { getTranslations } from "next-intl/server";
import { Button } from "@/components/public/button";

type AuthorBoxProps = {
  name: string;
  bio?: string;
};

export async function AuthorBox({ name, bio }: Readonly<AuthorBoxProps>) {
  const t = await getTranslations("author");

  return (
    <aside className="card mt-12">
      <p className="section-label mb-2">{t("label")}</p>
      <h2 className="font-display text-lg font-semibold text-text-primary">
        {name}
      </h2>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        {bio ?? t("bio")}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button href="/about" variant="secondary" className="text-sm px-4 min-h-10">
          {t("about")}
        </Button>
        <Button href="/contact" className="text-sm px-4 min-h-10">
          {t("contact")}
        </Button>
      </div>
    </aside>
  );
}
