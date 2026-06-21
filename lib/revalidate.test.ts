import { describe, expect, it } from "vitest";
import { getTagsForEntity } from "@/lib/revalidate";

describe("getTagsForEntity", () => {
  it("includes home when publishing a project", () => {
    expect(getTagsForEntity("project", { slug: "demo" })).toEqual([
      "projects",
      "home",
      "project:demo",
    ]);
  });

  it("deduplicates tags for page content updates", () => {
    expect(getTagsForEntity("page-content")).toEqual(["home", "page-content"]);
  });
});
