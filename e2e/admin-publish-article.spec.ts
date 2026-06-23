import { expect, test } from "@playwright/test";
import { deleteArticleBySlug, isE2EConfigured } from "./helpers/supabase";

const E2E_EXCERPT =
  "Artículo de prueba E2E para validar el flujo de publicación del CMS. " +
  "Debe tener al menos ciento sesenta caracteres para pasar la validación del formulario de artículos en el panel admin.";

test.describe("Admin publish article", () => {
  test.skip(!isE2EConfigured(), "E2E credentials not configured");

  test.use({ storageState: "e2e/.auth/admin.json" });

  const slug = `e2e-publish-${Date.now()}`;
  const title = `E2E Publish ${Date.now()}`;

  test.afterAll(async () => {
    await deleteArticleBySlug(slug);
  });

  test("publish article and show it on /blog", async ({ page }) => {
    await page.goto("/admin/articles/new");

    await page.getByTestId("article-title").fill(title);
    await page.getByTestId("article-slug").fill(slug);
    await page.getByTestId("article-excerpt").fill(E2E_EXCERPT);
    await page.getByTestId("article-content").fill(
      "# E2E\n\nContenido de prueba publicado desde Playwright.",
    );

    await page.getByTestId("article-submit").click();
    await page.waitForURL(/\/admin\/articles\/[^/]+/);

    await page.getByTestId("article-publish").click();
    await expect(page.getByTestId("article-publish")).toHaveText("Despublicar");

    await page.goto("/blog");
    await expect(page.getByRole("link", { name: title })).toBeVisible();
  });
});
