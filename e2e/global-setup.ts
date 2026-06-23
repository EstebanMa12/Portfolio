import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium, type FullConfig } from "@playwright/test";
import { isE2EConfigured } from "./helpers/supabase";

const authFile = path.join(__dirname, ".auth", "admin.json");

async function globalSetup(config: FullConfig) {
  if (!isE2EConfigured()) {
    console.warn("E2E: skipping auth setup — credentials not configured.");
    return;
  }

  const baseURL = config.projects[0]?.use?.baseURL ?? "http://localhost:3000";
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const response = await page.request.post(`${baseURL}/api/e2e/auth`, {
    headers: { "x-e2e-secret": process.env.E2E_TEST_SECRET! },
  });

  if (!response.ok()) {
    throw new Error(`E2E auth failed (${response.status()}): ${await response.text()}`);
  }

  await page.goto(`${baseURL}/admin`);
  await page.waitForURL(/\/admin$/);

  mkdirSync(path.dirname(authFile), { recursive: true });
  await context.storageState({ path: authFile });
  await browser.close();
}

export default globalSetup;
