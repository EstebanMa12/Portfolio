import { defineConfig } from "vitest/config";
import path from "path";
import { readFileSync, existsSync } from "fs";

function loadEnvLocal() {
  const envPath = path.resolve(__dirname, ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      process.env[key] ??= rest.join("=");
    }
  }
}

loadEnvLocal();

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
