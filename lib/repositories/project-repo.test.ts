import { describe, expect, it, vi, beforeEach } from "vitest";
import { syncProjectImages } from "@/lib/repositories/project-repo";

const mockFrom = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

vi.mock("@/lib/repositories/base", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/repositories/base")>();
  return {
    ...actual,
    unwrap: (result: { data: unknown; error: null }) => result.data,
  };
});

describe("syncProjectImages", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockEq.mockReturnValue({ error: null });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockInsert.mockReturnValue({ error: null });
    mockUpdate.mockReturnValue({ eq: mockEq });

    mockFrom.mockImplementation((table: string) => {
      if (table === "project_images") {
        return {
          delete: mockDelete,
          insert: mockInsert,
        };
      }
      if (table === "projects") {
        return {
          update: mockUpdate,
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });
  });

  it("deletes existing rows and inserts images in order", async () => {
    const images = [
      {
        imageUrl: "https://example.com/a.jpg",
        altText: "First",
        sortOrder: 0,
      },
      {
        imageUrl: "https://example.com/b.jpg",
        altText: "Second",
        sortOrder: 1,
      },
    ];

    await syncProjectImages("project-1", images);

    expect(mockDelete).toHaveBeenCalled();
    expect(mockInsert).toHaveBeenCalledWith([
      {
        project_id: "project-1",
        image_url: "https://example.com/a.jpg",
        alt_text: "First",
        sort_order: 0,
      },
      {
        project_id: "project-1",
        image_url: "https://example.com/b.jpg",
        alt_text: "Second",
        sort_order: 1,
      },
    ]);
    expect(mockUpdate).toHaveBeenCalledWith({
      cover_image_url: "https://example.com/a.jpg",
    });
  });

  it("clears cover image when gallery is empty", async () => {
    await syncProjectImages("project-1", []);

    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith({ cover_image_url: null });
  });
});
