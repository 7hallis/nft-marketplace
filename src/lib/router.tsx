
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import HomePage from "@/pages/HomePage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import Mercado from "@/pages/Mercado";
import Perfil from "@/pages/PerfilPage";
import Carteira from "@/pages/CarteiraPage";
import NFTDetailsPage from "@/pages/NFTDetailsPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import { PlaceholderPage } from "@/pages/src/pages/PlaceholderPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Início
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// Carrinho
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const carrinhoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carrinho",
  component: CartPage,
});

// Checkout
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

// Mercado
const mercadoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mercado",
  component: Mercado,
});

// Perfil
const perfilRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/perfil",
  component: Perfil,
});

// Carteira
const carteiraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carteira",
  component: Carteira,
});

// Detalhes do NFT
const NFTDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
  component: NFTDetailsPage,
});

// Histórico de pedidos
const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pedidos",
  component: OrderHistoryPage,
});

// Detalhes do pedido
const orderDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pedidos/$orderId",
  component: function OrderDetailsRouteComponent() {
    const { orderId } = orderDetailsRoute.useParams();

    return <OrderDetailsPage orderId={orderId} />;
  },
});

// Páginas auxiliares
const atividadeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/atividade",
  component: () => <PlaceholderPage title="Atividade" />,
});

const interessesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interesses",
  component: () => <PlaceholderPage title="Lista de interesse" />,
});

const ofertasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ofertas",
  component: () => <PlaceholderPage title="Ofertas" />,
});

const downloadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/downloads",
  component: () => <PlaceholderPage title="Arquivos baixados" />,
});

const suporteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/suporte",
  component: () => <PlaceholderPage title="Suporte" />,
});

// Árvore de rotas
const routeTree = rootRoute.addChildren([
  homeRoute,
  cartRoute,
  carrinhoRoute,
  checkoutRoute,
  mercadoRoute,
  perfilRoute,
  carteiraRoute,
  NFTDetailsRoute,
  orderHistoryRoute,
  orderDetailsRoute,
  atividadeRoute,
  interessesRoute,
  ofertasRoute,
  downloadsRoute,
  suporteRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
