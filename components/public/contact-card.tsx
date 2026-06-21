import { getTranslations } from "next-intl/server";
import { Button } from "@/components/public/button";
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
      <div className="flex flex-wrap justify-center gap-3">
        <Button href={`mailto:${contact.email}`}>
          <EmailIcon className="w-4 h-4" />
          {t("email")}
        </Button>
        <Button href={contact.linkedin} variant="secondary">
          <LinkedInIcon className="w-4 h-4" />
          {t("linkedin")}
        </Button>
        <Button href={contact.github} variant="secondary">
          <GitHubIcon className="w-4 h-4" />
          {t("github")}
        </Button>
      </div>
    </div>
  );
}
