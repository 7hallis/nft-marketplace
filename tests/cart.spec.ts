
import { test, expect } from "@playwright/test";

test.describe("Carrinho do Kurio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/carrinho");
  });

  test("deve carregar a página do carrinho", async ({ page }) => {
    await expect(
      page.getByText("Resumo da carteira")
    ).toBeVisible();

    await expect(
      page.getByText("Total", { exact: true })
    ).toBeVisible();
  });

  test("deve mostrar o estado vazio quando não houver NFTs", async ({
    page,
  }) => {
    await expect(
      page.getByText("Seu carrinho está vazio")
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Explorar mercado" })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Conectar e finalizar" })
    ).toBeDisabled();
  });

  test("deve informar que é necessário adicionar um NFT antes de usar o cupom", async ({
    page,
  }) => {
    await page.getByLabel("Código promocional").fill("KURIO10");

    await page.getByRole("button", { name: "Aplicar" }).click();

    await expect(
      page.getByText("Adicione um NFT antes de aplicar um cupom.")
    ).toBeVisible();
  });

  test("deve permitir acessar o mercado pelo carrinho vazio", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Explorar mercado" }).click();

    await expect(page).toHaveURL(/\/mercado$/);
  });
});
