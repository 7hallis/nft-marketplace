
import { test, expect } from "@playwright/test";

test("a página inicial do Kurio é carregada", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).not.toBeEmpty();
});
