import { describe, expect, it } from "vitest";
import { buildRecentActivity } from "./recent-activity";

describe("buildRecentActivity", () => {
  it("merges entities and sorts by updatedAt descending", () => {
    const activity = buildRecentActivity({
      projects: [
        {
          id: "p1",
          title: "Alpha",
          status: "draft",
          updatedAt: "2026-06-01T10:00:00Z",
        } as never,
      ],
      articles: [
        {
          id: "a1",
          title: "Latest post",
          status: "published",
          updatedAt: "2026-06-03T10:00:00Z",
        } as never,
      ],
      experiences: [
        {
          id: "e1",
          role: "Engineer",
          company: "Acme",
          updatedAt: "2026-06-02T10:00:00Z",
        } as never,
      ],
    });

    expect(activity.map((item) => item.id)).toEqual(["a1", "e1", "p1"]);
    expect(activity[0]?.href).toBe("/admin/articles/a1");
    expect(activity[1]?.title).toBe("Engineer · Acme");
  });

  it("respects the limit", () => {
    const activity = buildRecentActivity(
      {
        projects: [
          { id: "p1", title: "One", status: "draft", updatedAt: "2026-06-03T10:00:00Z" } as never,
          { id: "p2", title: "Two", status: "draft", updatedAt: "2026-06-02T10:00:00Z" } as never,
        ],
        articles: [],
        experiences: [],
      },
      1,
    );

    expect(activity).toHaveLength(1);
    expect(activity[0]?.id).toBe("p1");
  });
});
