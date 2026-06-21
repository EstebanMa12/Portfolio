import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { cn } from "@/lib/utils/cn";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export async function markdownToHtml(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: "github-dark",
      keepBackground: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return String(file);
}

export async function MarkdownContent({
  content,
  className,
}: MarkdownContentProps) {
  const html = await markdownToHtml(content);

  return (
    <div
      className={cn(
        "prose prose-invert prose-zinc max-w-none",
        "prose-headings:font-display prose-headings:tracking-tight",
        "prose-a:text-accent prose-code:text-accent",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
