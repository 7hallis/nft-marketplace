
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Package, RefreshCw } from "lucide-react";

import { getOrders, type Order } from "@/api/orders";

function formatEth(value: number | string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `${value} ETH`;
  }

  return `${amount.toLocaleString("pt-BR", {
    maximumFractionDigits: 8,
  })} ETH`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR");
}

function statusLabel(status: Order["status"]) {
  switch (status) {
    case "confirmed":
      return "Confirmado";
    default:
      return "Pendente";
  }
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          status?: number;
        };
      }
    ).response;

    if (response?.status === 401) {
      return "Sua sessão não foi reconhecida. Entre novamente para consultar seus pedidos.";
    }

    if (response?.status && response.status >= 500) {
      return "O serviço está indisponível no momento. Tente novamente em instantes.";
    }
  }

  return "Não foi possível consultar seus pedidos. Verifique sua conexão e tente novamente.";
}

export default function OrderHistoryPage() {
  const ordersQuery = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    retry: false,
    refetchOnWindowFocus: true,
  });

  return (
    <main className="min-h-screen bg-[#110B08] px-5 py-10 text-[#E8D9CE]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm text-[#B7A79B]">
            Sua conta Kurio
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Meus pedidos
          </h1>

          <p className="mt-3 text-[#B7A79B]">
            Consulte suas compras e acompanhe o status dos pagamentos.
          </p>
        </header>

        {ordersQuery.isPending && (
          <section
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            aria-live="polite"
          >
            <p className="text-[#B7A79B]">
              Carregando seus pedidos...
            </p>
          </section>
        )}

        {ordersQuery.isError && (
          <section
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            role="alert"
          >
            <h2 className="text-lg font-semibold">
              Não foi possível carregar os pedidos
            </h2>

            <p className="mt-2 text-sm text-[#B7A79B]">
              {getErrorMessage(ordersQuery.error)}
            </p>

            <button
              type="button"
              onClick={() => void ordersQuery.refetch()}
              disabled={ordersQuery.isFetching}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E99A4A] px-4 py-2 font-medium text-[#110B08] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  ordersQuery.isFetching ? "animate-spin" : ""
                }
              />
              {ordersQuery.isFetching
                ? "Carregando..."
                : "Tentar novamente"}
            </button>
          </section>
        )}

        {ordersQuery.isSuccess &&
          ordersQuery.data.length === 0 && (
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <Package
                className="mx-auto mb-4 text-[#E99A4A]"
                size={36}
              />

              <h2 className="text-xl font-semibold">
                Você ainda não tem pedidos
              </h2>

              <p className="mt-2 text-sm text-[#B7A79B]">
                Quando você realizar uma compra, ela aparecerá aqui.
              </p>

              <Link
                to="/mercado"
                className="mt-6 inline-flex rounded-lg bg-[#E99A4A] px-5 py-3 font-semibold text-[#110B08] hover:opacity-90"
              >
                Explorar o mercado
              </Link>
            </section>
          )}

        {ordersQuery.isSuccess &&
          ordersQuery.data.length > 0 && (
            <div className="space-y-4">
              {ordersQuery.data.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <p className="break-all text-sm text-[#B7A79B]">
                        Pedido #{order.id}
                      </p>

                      <p className="mt-1 text-sm">
                        {formatDate(order.date)}
                      </p>

                      <span className="mt-3 inline-flex rounded-full border border-[#E99A4A]/30 bg-[#E99A4A]/10 px-3 py-1 text-xs text-[#E99A4A]">
                        {statusLabel(order.status)}
                      </span>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-[#B7A79B]">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#E99A4A]">
                        {formatEth(order.total)}
                      </p>

                      <p className="mt-1 text-sm text-[#B7A79B]">
                        {order.items.reduce(
                          (total, item) =>
                            total + item.quantity,
                          0,
                        )}{" "}
                        item(ns)
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="min-w-0 flex-1 text-sm text-[#B7A79B]">
                      {order.items
                        .map((item) => item.name)
                        .join(", ")}
                    </p>

                    <Link
                      to="/pedidos/$orderId"
                      params={{ orderId: order.id }}
                      className="rounded-lg border border-[#E99A4A]/40 px-4 py-2 text-sm font-medium text-[#E99A4A] hover:bg-[#E99A4A]/10"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}
