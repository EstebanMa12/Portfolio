import { cn } from "@/lib/utils/cn";
import { Card } from "./card";

type MetricHighlightProps = {
  label: string;
  value: string;
  detail?: string;
  className?: string;
};

export function MetricHighlight({
  label,
  value,
  detail,
  className,
}: MetricHighlightProps) {
  return (
    <Card as="article" className={cn("metric-highlight py-5 px-6", className)}>
      <p className="text-metric-positive text-xs font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="metric-value mt-1 text-2xl font-semibold text-text-primary">
        {value}
      </p>
      {detail ? (
        <p className="mt-1 text-sm text-text-secondary">{detail}</p>
      ) : null}
    </Card>
  );
}

type MetricGridProps = {
  children: React.ReactNode;
  className?: string;
};

export function MetricGrid({ children, className }: MetricGridProps) {
  return (
    <div
      className={cn("grid gap-3 sm:grid-cols-2", className)}
      role="group"
      aria-label="Métricas de impacto"
    >
      {children}
    </div>
  );
}
