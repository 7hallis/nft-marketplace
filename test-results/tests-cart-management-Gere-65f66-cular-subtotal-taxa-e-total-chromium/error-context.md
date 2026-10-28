# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\cart-management.spec.ts >> Gerenciamento do carrinho >> deve exibir o NFT e calcular subtotal, taxa e total
- Location: tests\tests\cart-management.spec.ts:32:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Iron Ape #001').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Iron Ape #001').first() with timeout 5000ms
  - waiting for getByText('Iron Ape #001').first()

```

```yaml
- main:
  - link "KURIO":
    - /url: /
  - navigation:
    - link "Início":
      - /url: /
    - link "Mercado":
      - /url: /mercado
    - link "Criadores":
      - /url: /
    - link "Aprenda":
      - /url: /
  - button "Abrir pesquisa"
  - button "Carrinho de compras, 0 itens"
  - button "Entrar"
  - navigation "breadcrumb":
    - list:
      - listitem:
        - link "Início":
          - /url: /home
      - listitem:
        - link "Mercado":
          - /url: /mercado
      - listitem:
        - link "Carrinho" [disabled]
  - region "NFTs no carrinho":
    - paragraph: Seu carrinho está vazio
    - paragraph: Explore o mercado e encontre seu próximo NFT.
    - link "Explorar mercado":
      - /url: /mercado
  - complementary:
    - heading "Resumo da carteira" [level=2]
    - text: Código promocional
    - textbox "Código promocional":
      - /placeholder: Digite o código promocional...
    - button "Aplicar"
    - term: Subtotal
    - definition: 0.000 ETH
    - term: Desconto
    - definition: "- 0.000 ETH"
    - term: Taxa de rede estimada
    - definition: 0.000 ETH
    - text: Total 0.000 ETH
    - button "Conectar e finalizar" [disabled]
  - heading "Colecionadores também viram" [level=2]
  - article:
    - img "Macaco usando chapéu verde e moletom roxo"
    - paragraph: "Cosmic Bloom #118"
    - paragraph: 1.29 ETH
  - article:
    - img "Macaco usando chapéu verde e moletom roxo"
    - paragraph: "Violet #035"
    - paragraph: 1.39 ETH
  - article:
    - img "Macaco de pelo escuro usando roupa clara"
    - paragraph: "Ivory Baron #088"
    - paragraph: 1.79 ETH
  - article:
    - img "Macaco dourado usando fones de ouvido"
    - paragraph: "Golden Beat #207"
    - paragraph: 0.99 ETH
  - article:
    - img "Macaco dourado usando fones de ouvido"
    - paragraph: "Golden Signal #160"
    - paragraph: 0.39 ETH
  - region "Vantagens e novidades da Kurio":
    - article:
      - text: W
      - heading "Segurança da carteira" [level=3]
      - paragraph: Proteja sua carteira e colecione arte digital verificada com confiança.
    - article:
      - text: C
      - heading "Criadores em destaque" [level=3]
      - paragraph: Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
    - article:
      - text: D
      - heading "Alertas de lançamentos" [level=3]
      - paragraph: Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
    - article:
      - heading "Antecipe-se ao próximo lançamento" [level=3]
      - text: Seu e-mail
      - textbox "Seu e-mail":
        - /placeholder: digite seu e-mail...
      - button "Enviar"
      - paragraph: Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
  - link "Kurio - início":
    - /url: "#inicio"
    - text: KURIO
  - text: Feito para colecionadores, criadores e cultura
  - link "contato@email.com":
    - /url: mailto:contato@email.com
  - link "+55 11 4002 8922":
    - /url: tel:+551140028922
  - heading "Meu perfil" [level=2]
  - list:
    - listitem:
      - link "Meu perfil":
        - /url: "#perfil"
    - listitem:
      - link "Minha coleção":
        - /url: "#colecoes"
    - listitem:
      - link "Atividade":
        - /url: "#atividade"
    - listitem:
      - link "Estúdio do criador":
        - /url: "#criador"
    - listitem:
      - link "Lista de interesse":
        - /url: "#interesses"
  - heading "Central de ajuda" [level=2]
  - list:
    - listitem:
      - link "Central de ajuda":
        - /url: "#aprenda"
    - listitem:
      - link "Como comprar NFTs":
        - /url: "#aprenda"
    - listitem:
      - link "Carteira e segurança":
        - /url: "#aprenda"
    - listitem:
      - link "Política do mercado":
        - /url: "#aprenda"
    - listitem:
      - link "Denunciar item":
        - /url: mailto:contato@kurio.com
  - heading "Coleções" [level=2]
  - list:
    - listitem:
      - link "Arte digital":
        - /url: "#nfts"
    - listitem:
      - link "Fotografia":
        - /url: "#nfts"
    - listitem:
      - link "Música":
        - /url: "#nfts"
    - listitem:
      - link "Arte 3D":
        - /url: "#nfts"
    - listitem:
      - link "Utilidade":
        - /url: "#nfts"
  - heading "Redes sociais" [level=2]
  - link "Facebook":
    - /url: "#social"
    - text: f
  - link "Instagram":
    - /url: "#social"
  - link "Twitter":
    - /url: "#social"
  - link "LinkedIn":
    - /url: "#social"
    - text: in
  - link "YouTube":
    - /url: "#social"
  - heading "Carteiras compatíveis" [level=3]
  - text: METAMASK WALLETCONNECT COINBASE © 2026 Kurio. Propriedade digital para todos.
```

# Test source

```ts
  1   | 
  2   | import { test, expect } from "@playwright/test";
  3   | 
  4   | const nft = {
  5   |   id: "nft-test-001",
  6   |   name: "Iron Ape #001",
  7   |   price: 1.2,
  8   |   quantity: 2,
  9   |   image: "/nft1.png",
  10  |   alt: "NFT de teste",
  11  | };
  12  | 
  13  | test.describe("Gerenciamento do carrinho", () => {
  14  |   test.beforeEach(async ({ page }) => {
  15  |     await page.goto("/carrinho");
  16  | 
  17  |     await page.evaluate((item) => {
  18  |       localStorage.clear();
  19  |       localStorage.setItem(
  20  |         "kurio-cart:guest",
  21  |         JSON.stringify([item]),
  22  |       );
  23  |     }, nft);
  24  | 
  25  |     await page.reload();
  26  | 
  27  |     await expect(
  28  |       page.getByText(nft.name).first(),
> 29  |     ).toBeVisible();
      |       ^ Error: expect(locator).toBeVisible() failed
  30  |   });
  31  | 
  32  |   test("deve exibir o NFT e calcular subtotal, taxa e total", async ({
  33  |     page,
  34  |   }) => {
  35  |     await expect(
  36  |       page.getByText("2.400 ETH", { exact: true }),
  37  |     ).toBeVisible();
  38  | 
  39  |     await expect(
  40  |       page.getByText("0.016 ETH", { exact: true }),
  41  |     ).toBeVisible();
  42  | 
  43  |     await expect(
  44  |       page.getByText("2.416 ETH", { exact: true }),
  45  |     ).toBeVisible();
  46  |   });
  47  | 
  48  |   test("deve aumentar a quantidade e atualizar os valores", async ({
  49  |     page,
  50  |   }) => {
  51  |     await page
  52  |       .getByRole("button", {
  53  |         name: `Aumentar quantidade de ${nft.name}`,
  54  |       })
  55  |       .first()
  56  |       .click();
  57  | 
  58  |     await expect(
  59  |       page.getByText("3.600 ETH", { exact: true }),
  60  |     ).toBeVisible();
  61  | 
  62  |     await expect(
  63  |       page.getByText("3.616 ETH", { exact: true }),
  64  |     ).toBeVisible();
  65  |   });
  66  | 
  67  |   test("deve diminuir a quantidade e atualizar os valores", async ({
  68  |     page,
  69  |   }) => {
  70  |     await page
  71  |       .getByRole("button", {
  72  |         name: `Diminuir quantidade de ${nft.name}`,
  73  |       })
  74  |       .first()
  75  |       .click();
  76  | 
  77  |     await expect(
  78  |       page.getByText("1.200 ETH", { exact: true }),
  79  |     ).toBeVisible();
  80  | 
  81  |     await expect(
  82  |       page.getByText("1.216 ETH", { exact: true }),
  83  |     ).toBeVisible();
  84  |   });
  85  | 
  86  |   test("deve remover o NFT e exibir o carrinho vazio", async ({
  87  |     page,
  88  |   }) => {
  89  |     await page
  90  |       .getByRole("button", {
  91  |         name: `Remover ${nft.name} do carrinho`,
  92  |       })
  93  |       .first()
  94  |       .click();
  95  | 
  96  |     await expect(
  97  |       page.getByText("Seu carrinho está vazio"),
  98  |     ).toBeVisible();
  99  | 
  100 |     await expect(
  101 |       page.getByText("0.000 ETH", { exact: true }),
  102 |     ).toBeVisible();
  103 |   });
  104 | 
  105 |   test("deve aplicar o cupom KURIO10 e calcular o desconto", async ({
  106 |     page,
  107 |   }) => {
  108 |     await page.getByLabel("Código promocional").fill("KURIO10");
  109 | 
  110 |     await page.getByRole("button", { name: "Aplicar" }).click();
  111 | 
  112 |     await expect(
  113 |       page.getByText(
  114 |         "Cupom KURIO10 aplicado: 10% de desconto.",
  115 |       ),
  116 |     ).toBeVisible();
  117 | 
  118 |     await expect(
  119 |       page.getByText("- 0.240 ETH", { exact: true }),
  120 |     ).toBeVisible();
  121 | 
  122 |     await expect(
  123 |       page.getByText("2.176 ETH", { exact: true }),
  124 |     ).toBeVisible();
  125 |   });
  126 | 
  127 |   test("deve rejeitar um cupom inválido", async ({ page }) => {
  128 |     await page
  129 |       .getByLabel("Código promocional")
```