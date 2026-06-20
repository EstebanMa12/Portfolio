import { Button } from "@/components/public/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-gutter py-24 text-center">
      <p className="section-label mb-3">404</p>
      <h1 className="font-display text-3xl font-semibold text-text-primary">
        Página no encontrada
      </h1>
      <p className="mt-4 max-w-md text-text-secondary">
        La ruta que buscas no existe o fue movida.
      </p>
      <Button href="/" variant="secondary" className="mt-8">
        Volver al inicio
      </Button>
    </main>
  );
}
