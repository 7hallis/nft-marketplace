
import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { router } from "@/lib/router";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import "@/index.css";

import { socket } from "@/lib/socket";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

async function enableMocking(): Promise<void> {
  const shouldEnableMocks =
    import.meta.env.DEV ||
    import.meta.env.VITE_ENABLE_MSW === "true";

  if (!shouldEnableMocks) {
    console.info("[MSW] Mocking desabilitado.");
    return;
  }

  const { worker } = await import("@/mocks/browser");

  await worker.start({
    onUnhandledRequest: "bypass",
  });

  console.info("[MSW] Mocking enabled.");
}
function handleOrderEvent() {
  void queryClient.invalidateQueries({
    queryKey: ["orders"],
  });
}
async function bootstrap(): Promise<void> {
  await enableMocking();

  socket.connect();
  socket.on("order:created", handleOrderEvent);
  socket.on("order:updated", handleOrderEvent);
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

bootstrap().catch((error: unknown) => {
  console.error(
    "Erro ao inicializar a aplicação:",
    error,
  );
});
