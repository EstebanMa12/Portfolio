import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { PRIMARY_NAV, SOCIAL_LINKS } from "@/lib/config/site";
import { EmailIcon, GitHubIcon, LinkedInIcon } from "./icons";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tDock = await getTranslations("dock");
  const tContact = await getTranslations("contact");
  const year = new Date().getFullYear();

  const internalLinks = PRIMARY_NAV.filter((item) => item.key !== "home");

  return (
    <footer className="border-t border-border py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-gutter flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div>
            <p className="text-sm text-text-muted">
              © {year} Esteban Maya. {t("tagline")}.
            </p>
          </div>

          <nav aria-label={t("internalNav")}>
            <ul className="flex flex-wrap gap-x-6 gap-y-3" role="list">
              {internalLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("socialNav")} className="flex flex-wrap items-center gap-6">
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
      </div>
    </footer>
  );
}
