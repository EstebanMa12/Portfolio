"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { trackCtaClick, type CtaEventType } from "@/lib/analytics/track";
import { cn } from "@/lib/utils/cn";

type CtaButtonProps = {
  eventType: CtaEventType;
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
};

export function CtaButton({
  eventType,
  href,
  variant = "primary",
  className,
  children,
}: Readonly<CtaButtonProps>) {
  const pathname = usePathname();
  const classes = cn(
    variant === "primary" ? "btn-primary" : "btn-secondary",
    className,
  );

  const handleClick = () => {
    trackCtaClick(eventType, pathname ?? "/");
  };

  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={handleClick}>
      {children}
    </Link>
  );
}
