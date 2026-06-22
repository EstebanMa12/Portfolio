import { getTranslations } from "next-intl/server";
import { CtaButton } from "@/components/analytics/cta-button";
import { GitHubIcon, LinkedInIcon, EmailIcon } from "@/components/public/icons";
import type { ContactContent } from "@/lib/schemas/page-content";

type ContactCardProps = {
  contact: ContactContent;
  /** Use h2 when embedded in home (hero already owns the page h1). */
  headingLevel?: "h1" | "h2";
  headingId?: string;
};

export async function ContactCard({
  contact,
  headingLevel = "h2",
  headingId,
}: Readonly<ContactCardProps>) {
  const t = await getTranslations("contact");
  const Heading = headingLevel;

  return (
    <div className="card text-center py-12 md:py-16 px-6 max-w-2xl mx-auto">
      <Heading
        id={headingId}
        className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-4"
      >
        {contact.title}
      </Heading>
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
