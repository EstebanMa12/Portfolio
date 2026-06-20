import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "article" | "div" | "section";
};

export function Card({ children, className, as: Tag = "div" }: CardProps) {
  return <Tag className={cn("card", className)}>{children}</Tag>;
}
