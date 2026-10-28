# Kurio — NFT Marketplace

Marketplace de NFTs desenvolvido como desafio técnico, com foco em uma interface moderna, responsiva e em uma experiência de compra intuitiva.

O Kurio permite explorar coleções digitais, visualizar NFTs, gerenciar um carrinho de compras e simular o processo de checkout. O projeto também utiliza comunicação em tempo real com Socket.IO para demonstrar a transmissão de eventos relacionados aos pedidos.

## ✨ Funcionalidades

- **Exploração de NFTs:** visualização de NFTs em cards com imagens, nomes e preços.
- **Filtros e navegação:** recursos para facilitar a descoberta de itens.
- **Carrinho de compras:** gerenciamento dos itens selecionados.
- **Checkout:** formulário para finalizar pedidos simulados.
- **Autenticação simulada:** fluxo de acesso para demonstração da experiência do usuário.
- **Carteira digital simulada:** representação do fluxo de conexão de carteira.
- **Pedidos:** criação e confirmação de pedidos por meio de uma API simulada.
- **Comunicação em tempo real:** emissão e recebimento de eventos `order:created` com Socket.IO.
- **Interface responsiva:** adaptação da interface para diferentes tamanhos de tela.

## 🛠️ Tecnologias utilizadas

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Axios
- Tailwind CSS
- shadcn/ui
- Lucide React
- Mock Service Worker (MSW)
- Socket.IO
- Playwright — testes end-to-end, caso configurados no projeto

## 📋 Pré-requisitos

Antes de executar o projeto, instale:

- [Node.js](https://nodejs.org/) — versão compatível com as dependências do projeto.
- npm, instalado com o Node.js.

## 🚀 Instalação

Clone o repositório:

```bash
git clone https://github.com/7hallis/nft-marketplace.git
```

Entre na pasta do projeto:

```bash
cd nft-marketplace
```

Instale as dependências:

```bash
npm install
```

## ▶️ Executando o projeto

### Aplicação frontend

```bash
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em:

http://localhost:5173

### Servidor Socket.IO

Em outro terminal, execute:

```bash
npm run dev:socket
```

O servidor Socket.IO deve estar disponível em `http://localhost:3001`, conforme a configuração atual do projeto.

> Verifique os scripts definidos no `package.json` caso os comandos ou as portas tenham sido alterados.

## 🔄 API simulada e comunicação em tempo real

O projeto utiliza MSW para interceptar requisições HTTP e simular respostas da API durante o desenvolvimento.

O fluxo de criação de pedidos funciona da seguinte forma:

1. O usuário preenche o checkout.
2. A aplicação envia uma requisição para a API simulada.
3. A API retorna o pedido criado.
4. O frontend emite o evento `order:created` pelo Socket.IO.
5. O servidor recebe o evento e o retransmite aos clientes conectados.
6. As sessões conectadas podem receber o pedido em tempo real.

O fluxo foi verificado em sessões diferentes do navegador durante o desenvolvimento.

**Importante:** os dados de pedidos gerados pela API simulada não representam persistência em um banco de dados real. A comunicação Socket.IO demonstra a

🧪 Testes

O projeto utiliza Playwright para testes end-to-end da aplicação.

Executar os testes

npm run test:e2e

O Playwright inicia o servidor de desenvolvimento quando necessário e executa os testes configurados.

Teste implementado

Carregamento da página inicial: verifica se a página inicial é carregada e se o elemento principal do documento está visível.

Build de produção

npm run build

Esse comando verifica os tipos TypeScript e gera a versão de produção da aplicação.