
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
import Carrinho from "@/pages/CartPage";
import Perfil from "@/pages/PerfilPage";
import Carteira from "@/pages/CarteiraPage";
import NFTDetailsPage from "@/pages/NFTDetailsPage";
import { PlaceholderPage } from "@/pages/src/pages/PlaceholderPage"; 

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const mercadoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mercado",
  component: Mercado,
});

const carrinhoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carrinho",
  component: Carrinho,
});

const perfilRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/perfil",
  component: Perfil,
});

const carteiraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carteira",
  component: Carteira,
});

function NFTDetailsRouteComponent() {
  const { nftId } = NFTDetailsRoute.useParams();

  return <NFTDetailsPage {...({ nftId } as any)} />;
}

const NFTDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "nft/$nftId",
  component: NFTDetailsRouteComponent,
});

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


const routeTree = rootRoute.addChildren([
  homeRoute,
  cartRoute,
  checkoutRoute,
  mercadoRoute,
  carrinhoRoute,
  perfilRoute,
  carteiraRoute,
  atividadeRoute,
  interessesRoute,
  ofertasRoute,
  downloadsRoute,
  suporteRoute,
  NFTDetailsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
