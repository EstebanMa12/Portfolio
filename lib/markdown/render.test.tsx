import { describe, expect, it } from "vitest";
import { markdownToHtml } from "./render";

describe("markdownToHtml", () => {
  it("renders markdown headings and code blocks", async () => {
    const html = await markdownToHtml("# Hello\n\n```ts\nconst x = 1;\n```");

    expect(html).toContain("<h1");
    expect(html).toContain("Hello");
    expect(html).toContain("<code");
  });
});
