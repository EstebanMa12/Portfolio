import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, devices } from "@playwright/test";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator);
    const value = trimmed.slice(separator + 1);
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

const e2eConfigured = Boolean(
  process.env.E2E_TEST_SECRET &&
    process.env.E2E_ADMIN_EMAIL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    ...(e2eConfigured
      ? [
          {
            name: "setup",
            testMatch: /.*\.setup\.ts/,
          } as const,
        ]
      : []),
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(e2eConfigured ? { storageState: "e2e/.auth/admin.json" } : {}),
      },
      ...(e2eConfigured ? { dependencies: ["setup"] as const } : {}),
      testIgnore: /.*\.setup\.ts/,
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: "pnpm run dev",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
