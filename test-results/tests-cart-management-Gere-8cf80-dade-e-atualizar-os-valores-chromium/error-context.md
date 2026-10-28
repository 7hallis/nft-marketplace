# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\cart-management.spec.ts >> Gerenciamento do carrinho >> deve aumentar a quantidade e atualizar os valores
- Location: tests\tests\cart-management.spec.ts:48:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Iron Ape #001').first()
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Iron Ape #001').first() with timeout 5000ms
  - waiting for getByText('Iron Ape #001').first()
  - Target page, context or browser has been closed

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

```
Error: browserContext.close: Target page, context or browser has been closed
```