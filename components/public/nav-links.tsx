"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { PRIMARY_NAV } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

type NavLinksProps = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({
  className,
  linkClassName,
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <ul className={cn("flex", className)}>
      {PRIMARY_NAV.map(({ key, href }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "nav-link text-sm font-medium pb-1",
                isActive && "nav-active",
                linkClassName,
              )}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
            >
              {t(key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
