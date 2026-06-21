import { Button } from "@/components/public/button";
import { GitHubIcon, LinkedInIcon, EmailIcon } from "@/components/public/icons";
import type { ContactContent } from "@/lib/schemas/page-content";

type ContactCardProps = {
  contact: ContactContent;
};

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="card card-interactive text-center py-12 md:py-16 px-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-4">
        {contact.title}
      </h1>
      <p className="text-text-secondary text-base max-w-prose mx-auto mb-8 leading-relaxed">
        {contact.description}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href={`mailto:${contact.email}`}>
          <EmailIcon className="w-4 h-4" />
          Email
        </Button>
        <Button href={contact.linkedin} variant="secondary">
          <LinkedInIcon className="w-4 h-4" />
          LinkedIn
        </Button>
        <Button href={contact.github} variant="secondary">
          <GitHubIcon className="w-4 h-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
