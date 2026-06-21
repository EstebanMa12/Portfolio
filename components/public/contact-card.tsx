import { getTranslations } from "next-intl/server";
import { CtaButton } from "@/components/analytics/cta-button";
import { GitHubIcon, LinkedInIcon, EmailIcon } from "@/components/public/icons";
import type { ContactContent } from "@/lib/schemas/page-content";

type ContactCardProps = {
  contact: ContactContent;
};

export async function ContactCard({ contact }: Readonly<ContactCardProps>) {
  const t = await getTranslations("contact");

  return (
    <div className="card text-center py-12 md:py-16 px-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-4">
        {contact.title}
      </h1>
      <p className="text-text-secondary text-base max-w-prose mx-auto mb-8 leading-relaxed">
        {contact.description}
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
        <CtaButton href={`mailto:${contact.email}`} eventType="email">
          <EmailIcon className="w-4 h-4" />
          {t("email")}
        </CtaButton>
        <CtaButton href={contact.linkedin} variant="secondary" eventType="linkedin">
          <LinkedInIcon className="w-4 h-4" />
          {t("linkedin")}
        </CtaButton>
        <CtaButton href={contact.github} variant="secondary" eventType="github">
          <GitHubIcon className="w-4 h-4" />
          {t("github")}
        </CtaButton>
      </div>
    </div>
  );
}
