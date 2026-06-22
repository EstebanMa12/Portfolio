import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export const textLinkClassName =
  "text-accent hover:text-text-primary transition-colors";

type TextLinkProps = React.ComponentProps<typeof Link> & {
  showArrow?: boolean;
  size?: "sm" | "xs";
};

const sizeClassName = {
  sm: "text-sm font-medium",
  xs: "text-[11px] font-semibold",
} as const;

export function TextLink({
  className,
  showArrow = false,
  size = "sm",
  children,
  ...props
}: Readonly<TextLinkProps>) {
  return (
    <Link
      {...props}
      className={cn(
        textLinkClassName,
        sizeClassName[size],
        showArrow && "inline-flex items-center gap-1.5",
        className,
      )}
    >
      {children}
      {showArrow ? <span aria-hidden="true">→</span> : null}
    </Link>
  );
}
