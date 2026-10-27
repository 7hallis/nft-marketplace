
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
  
  const MercadoRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/mercado",
    component: Mercado,
  });
  
  const CarrinhoRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/carrinho",
    component: Carrinho,
  });

  const PerfilRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/perfil",
    component: Perfil,
  });
  
  const CarteiraRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/carteira",
    component: Carteira,
  });
  
  const routeTree = rootRoute.addChildren([
    homeRoute,
    cartRoute,
    checkoutRoute,
    MercadoRoute,
    CarrinhoRoute,
    PerfilRoute,
    CarteiraRoute,

  ]);
  
  export const router = createRouter({ routeTree });
  
  declare module "@tanstack/react-router" {
    interface Register {
      router: typeof router;
    }
  }
  