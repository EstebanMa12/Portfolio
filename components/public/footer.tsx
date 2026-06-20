import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/config/site";
import { EmailIcon, GitHubIcon, LinkedInIcon } from "./icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-text-muted">
          © {year} {SITE_NAME}. Software Engineer.
        </p>
        <nav aria-label="Redes sociales" className="flex items-center gap-6">
          <Link
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <GitHubIcon className="w-4 h-4" />
            GitHub
          </Link>
          <Link
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <LinkedInIcon className="w-4 h-4" />
            LinkedIn
          </Link>
          <Link
            href={SOCIAL_LINKS.email}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <EmailIcon />
            Email
          </Link>
        </nav>
      </div>
    </footer>
  );
}
