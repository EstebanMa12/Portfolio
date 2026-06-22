"use client";

import { useEffect, useState } from "react";
import { previewMarkdown } from "@/app/admin/articles/actions";
import { cn } from "@/lib/utils/cn";

type MarkdownPreviewProps = {
  content: string;
  className?: string;
};

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!content.trim()) return;

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        const rendered = await previewMarkdown(content);
        if (!cancelled) {
          setHtml(rendered);
        }
      } catch {
        if (!cancelled) {
          setHtml("<p class='text-red-400'>Error al renderizar el preview.</p>");
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [content]);

  if (!content.trim()) {
    return (
      <p className="text-sm text-text-muted">
        Escribe markdown para ver la vista previa.
      </p>
    );
  }

  if (!html) {
    return <p className="text-sm text-text-muted">Generando vista previa…</p>;
  }

  return (
    <div
      className={cn(
        "prose prose-zinc max-w-none dark:prose-invert",
        "prose-headings:font-display prose-headings:tracking-tight",
        "prose-a:text-accent prose-code:text-accent",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
