"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/public/icons";
import { cn } from "@/lib/utils/cn";

const DOCK_SECTIONS = ["hero", "projects", "lab", "skills", "contact"] as const;
type DockSection = (typeof DOCK_SECTIONS)[number];

const PATH_SECTION_MAP: Partial<Record<string, DockSection>> = {
  "/": "hero",
  "/projects": "projects",
  "/blog": "lab",
  "/about": "skills",
  "/contact": "contact",
};

type SideDockProps = {
  cvUrl?: string;
  github: string;
  linkedin: string;
};

type DockNavItem = {
  id: DockSection;
  labelKey: "home" | "projects" | "lab" | "skills" | "contact";
  href: "/#hero" | "/#projects" | "/#lab" | "/#skills" | "/#contact";
  icon: ReactNode;
};

type DockLinkProps = {
  label: string;
  active?: boolean;
  className?: string;
  children: ReactNode;
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
};

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

function handleHashClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const hash = href.split("#")[1];
  if (!hash || !isHomePath(window.location.pathname)) return;

  event.preventDefault();
  scrollToSection(hash);
}

function DockLink({
  label,
  active = false,
  className,
  children,
  href,
  onClick,
  external = false,
}: DockLinkProps) {
  const linkClass = cn("dock-link", active && "dock-active", className);

  const content = (
    <>
      <span className="dock-tooltip">{label}</span>
      {children}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={linkClass}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={linkClass}
      aria-label={label}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
    >
      {content}
    </Link>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
    </svg>
  );
}

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function LabIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

function SkillsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ContactIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function getInitialScrollSection(): DockSection {
  if (typeof window === "undefined") return "hero";
  const hash = window.location.hash.slice(1);
  return DOCK_SECTIONS.includes(hash as DockSection)
    ? (hash as DockSection)
    : "hero";
}

function isHomePath(pathname: string): boolean {
  return pathname === "/" || pathname === "/en";
}

export function SideDock({ cvUrl, github, linkedin }: SideDockProps) {
  const pathname = usePathname();
  const t = useTranslations("dock");
  const [scrollActive, setScrollActive] = useState<DockSection>(
    getInitialScrollSection,
  );
  const hasCv = Boolean(cvUrl?.trim());
  const activeSection = isHomePath(pathname)
    ? scrollActive
    : (PATH_SECTION_MAP[pathname] ?? null);

  const navItems: DockNavItem[] = [
    { id: "hero", labelKey: "home", href: "/#hero", icon: <HomeIcon className="w-5 h-5" /> },
    { id: "projects", labelKey: "projects", href: "/#projects", icon: <ProjectsIcon className="w-5 h-5" /> },
    { id: "lab", labelKey: "lab", href: "/#lab", icon: <LabIcon className="w-5 h-5" /> },
    { id: "skills", labelKey: "skills", href: "/#skills", icon: <SkillsIcon className="w-5 h-5" /> },
    { id: "contact", labelKey: "contact", href: "/#contact", icon: <ContactIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (!isHomePath(pathname)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setScrollActive(entry.target.id as DockSection);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    DOCK_SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!isHomePath(pathname)) return;
    const hash = window.location.hash.slice(1);
    if (!DOCK_SECTIONS.includes(hash as DockSection)) return;

    const timer = window.setTimeout(() => scrollToSection(hash), 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <aside
      aria-label={t("quickAccess")}
      className="side-dock fixed top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center xl:flex left-[max(1.25rem,calc((100%-72rem)/2-4.75rem))]"
    >
      <nav aria-label={t("sideNav")}>
        <ul className="flex flex-col items-center gap-1.5" role="list">
          {navItems.map((item) => (
            <li key={item.id}>
              <DockLink
                href={item.href}
                label={t(item.labelKey)}
                active={activeSection === item.id}
                onClick={(event) => handleHashClick(event, item.href)}
              >
                {item.icon}
              </DockLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="dock-divider" aria-hidden="true" />

      <nav aria-label={t("socialNav")}>
        <ul className="flex flex-col items-center gap-1.5" role="list">
          <li>
            <DockLink href={github} label={t("github")} external>
              <GitHubIcon className="w-5 h-5" />
            </DockLink>
          </li>
          <li>
            <DockLink href={linkedin} label={t("linkedin")} external>
              <LinkedInIcon className="w-5 h-5" />
            </DockLink>
          </li>
          {hasCv ? (
            <li>
              <DockLink href={cvUrl!} label={t("downloadCv")} external>
                <DownloadIcon className="w-5 h-5" />
              </DockLink>
            </li>
          ) : null}
        </ul>
      </nav>
    </aside>
  );
}
