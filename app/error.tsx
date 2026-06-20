"use client";

import { useEffect } from "react";
import { Button } from "@/components/public/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-gutter py-24 text-center">
      <p className="section-label mb-3">Error</p>
      <h1 className="font-display text-3xl font-semibold text-text-primary">
        Algo salió mal
      </h1>
      <p className="mt-4 max-w-md text-text-secondary">
        Ocurrió un error inesperado. Puedes intentar de nuevo.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button type="button" onClick={reset}>
          Reintentar
        </Button>
        <Button href="/" variant="secondary">
          Volver al inicio
        </Button>
      </div>
    </main>
  );
}
