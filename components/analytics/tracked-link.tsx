"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { trackCtaClick, type CtaEventType } from "@/lib/analytics/track";
import { cn } from "@/lib/utils/cn";

type TrackedLinkProps = React.ComponentProps<typeof Link> & {
  eventType: CtaEventType;
};

export function TrackedLink({
  eventType,
  className,
  onClick,
  ...props
}: Readonly<TrackedLinkProps>) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(className)}
      onClick={(event) => {
        trackCtaClick(eventType, pathname ?? "/");
        onClick?.(event);
      }}
    />
  );
}
