import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ContactCard } from "@/components/public/contact-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { getContactContent } from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const contact = await getContactContent(locale);
  return createPageMetadata(locale, "/contact", {
    title: contact?.title,
    description: contact?.description,
  });
}

export default async function ContactPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "contact" });
  const contact = await getContactContent(locale);

  if (!contact) {
    notFound();
  }

  return (
    <section aria-labelledby="contact-heading" className="py-8">
      <h1 id="contact-heading" className="sr-only">
        {t("title")}
      </h1>
      <RevealOnScroll>
        <ContactCard contact={contact} />
      </RevealOnScroll>
    </section>
  );
}
