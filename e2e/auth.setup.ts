import { mkdirSync } from "node:fs";
import path from "node:path";
import { test as setup, expect } from "@playwright/test";
import { isE2EConfigured } from "./helpers/supabase";

const authFile = path.join(__dirname, ".auth", "admin.json");

setup("authenticate admin", async ({ page }) => {
  setup.skip(!isE2EConfigured(), "E2E credentials not configured");

  const response = await page.request.post("/api/e2e/auth", {
    headers: { "x-e2e-secret": process.env.E2E_TEST_SECRET! },
  });

  expect(response.ok()).toBeTruthy();

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin$/);

  mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
