import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/config/site";
import { ScrollHeader } from "@/components/motion/scroll-header";
import { Button } from "./button";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

type HeaderProps = {
  siteName?: string;
};

export function Header({ siteName = SITE_NAME }: HeaderProps) {
  return (
    <ScrollHeader>
      <div className="max-w-6xl mx-auto px-gutter h-16 flex items-center justify-between gap-4 relative">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-tight text-text-primary shrink-0"
        >
          {siteName}
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-8">
          <NavLinks className="items-center gap-8" />
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </Link>
          <Link
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </Link>
          <Button href="/contact" className="text-sm px-5">
            Contactar
          </Button>
        </div>

        <MobileNav />
      </div>
    </ScrollHeader>
  );
}
