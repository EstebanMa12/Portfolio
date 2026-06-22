"use client";

import { track } from "@vercel/analytics";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

type TrackedLinkProps = React.ComponentProps<typeof Link> & {
  eventType: string;
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
        track("cta_click", {
          type: eventType,
          page: pathname ?? "/",
        });
        onClick?.(event);
      }}
    />
  );
}
