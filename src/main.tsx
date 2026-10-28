
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

import { testMockWebSocket } from "@/mocks/websocket-test";

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
enableMocking().then(() => {
  ReactDOM.createRoot(
    document.getElementById("root")!,
  ).render(
    <React.StrictMode>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </CartProvider>
    </React.StrictMode>,
  );
});
