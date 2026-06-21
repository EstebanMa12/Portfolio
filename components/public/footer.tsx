import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { SOCIAL_LINKS } from "@/lib/config/site";
import { EmailIcon, GitHubIcon, LinkedInIcon } from "./icons";

export async function Footer() {
  const t = await getTranslations("footer");
  const tDock = await getTranslations("dock");
  const tContact = await getTranslations("contact");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-text-muted">
          © {year} Esteban Maya. {t("tagline")}.
        </p>
        <nav aria-label={t("socialNav")} className="flex items-center gap-6">
          <Link
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <GitHubIcon className="w-4 h-4" />
            {tDock("github")}
          </Link>
          <Link
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <LinkedInIcon className="w-4 h-4" />
            {tDock("linkedin")}
          </Link>
          <Link
            href={SOCIAL_LINKS.email}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <EmailIcon />
            {tContact("email")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
