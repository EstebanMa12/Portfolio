import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "article" | "div" | "section";
  interactive?: boolean;
};

export function Card({
  children,
  className,
  as: Tag = "div",
  interactive = false,
}: CardProps) {
  return (
    <Tag className={cn("card", interactive && "card-interactive", className)}>
      {children}
    </Tag>
  );
}
