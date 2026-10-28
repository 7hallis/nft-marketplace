
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { router } from "@/lib/router";
import { CartProvider } from "@/contexts/CartContext";
import "@/index.css";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");

    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}
async function bootstrap() {
  await enableMocking();

  ReactDOM.createRoot(
    document.getElementById("root")!,
  ).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

bootstrap().catch((error) => {
  console.error("Erro ao inicializar a aplicação:", error);
});
