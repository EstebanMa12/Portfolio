import { cn } from "@/lib/utils";

type AppLoaderProps = {
  variant?: "fullscreen" | "inline";
  label?: string;
  ariaLabel?: string;
  className?: string;
};

export function AppLoader({
  variant = "inline",
  label = "Sincronizando",
  ariaLabel = "Cargando",
  className,
}: Readonly<AppLoaderProps>) {
  const isFullscreen = variant === "fullscreen";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "app-loader",
        isFullscreen ? "app-loader--fullscreen" : "app-loader--inline",
        className,
      )}
    >
      <span className="sr-only">{ariaLabel}</span>

      {isFullscreen ? <div className="app-loader-bar" aria-hidden /> : null}

      <div className="app-loader-stage" aria-hidden>
        <div className="app-loader-grid" />
        <div className="app-loader-beam" />
        <div className="app-loader-core">
          <div className="app-loader-ring app-loader-ring--outer" />
          <div className="app-loader-ring app-loader-ring--inner" />
          <div className="app-loader-diamond" />
        </div>
        <p className="app-loader-caption font-mono">
          <span>{label}</span>
          <span className="app-loader-caption-dots" aria-hidden>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
}
