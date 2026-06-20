import { cn } from "@/lib/utils/cn";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ children, className }: SectionLabelProps) {
  return <p className={cn("section-label", className)}>{children}</p>;
}
