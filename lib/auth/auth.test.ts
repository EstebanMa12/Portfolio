import { describe, expect, it, vi, beforeEach } from "vitest";
import { getLoginErrorMessage } from "./errors";

describe("getLoginErrorMessage", () => {
  it("returns unauthorized message", () => {
    expect(getLoginErrorMessage("unauthorized")).toContain("no está autorizada");
  });

  it("returns auth message for unknown codes", () => {
    expect(getLoginErrorMessage("unknown")).toContain("No se pudo completar");
  });

  it("returns null when no code", () => {
    expect(getLoginErrorMessage(null)).toBeNull();
  });
});

describe("isWhitelistedAdmin", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns true when admin row exists", async () => {
    const { isWhitelistedAdmin } = await import("./is-whitelisted-admin");
    const supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: "abc" }, error: null }),
          }),
        }),
      }),
    };

    await expect(
      isWhitelistedAdmin(supabase as never, "abc"),
    ).resolves.toBe(true);
  });

  it("returns false on query error", async () => {
    const { isWhitelistedAdmin } = await import("./is-whitelisted-admin");
    const supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: "fail" } }),
          }),
        }),
      }),
    };

    await expect(
      isWhitelistedAdmin(supabase as never, "abc"),
    ).resolves.toBe(false);
  });
});
