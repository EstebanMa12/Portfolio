import { Button } from "@/components/public/button";

type AuthorBoxProps = {
  name: string;
  bio?: string;
};

export function AuthorBox({
  name,
  bio = "Software Engineer especializado en backend y sistemas distribuidos.",
}: AuthorBoxProps) {
  return (
    <aside className="card mt-12">
      <p className="section-label mb-2">Autor</p>
      <h2 className="font-display text-lg font-semibold text-text-primary">
        {name}
      </h2>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">{bio}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button href="/about" variant="secondary" className="text-sm px-4 min-h-10">
          Sobre mí
        </Button>
        <Button href="/contact" className="text-sm px-4 min-h-10">
          Contactar
        </Button>
      </div>
    </aside>
  );
}
