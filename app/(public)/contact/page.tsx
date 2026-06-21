import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactCard } from "@/components/public/contact-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { getContactContent } from "@/lib/cache/public-queries";
import { createPageMetadata } from "@/lib/domain/seo/create-page-metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactContent();
  return createPageMetadata("/contact", {
    title: contact?.title ?? "Contacto",
    description: contact?.description,
  });
}

export default async function ContactPage() {
  const contact = await getContactContent();

  if (!contact) {
    notFound();
  }

  return (
    <section aria-labelledby="contact-heading" className="py-8">
      <h1 id="contact-heading" className="sr-only">
        Contacto
      </h1>
      <RevealOnScroll>
        <ContactCard contact={contact} />
      </RevealOnScroll>
    </section>
  );
}
