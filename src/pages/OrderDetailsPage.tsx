
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Package, RefreshCw } from "lucide-react";
import { api } from "@/api/client";

type OrderStatus = "pending" | "confirmed" | "declined";

interface OrderDetailsPageProps {
  orderId: string;
}

interface OrderItem {
  nftId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  couponCode?: string;
  walletType: string;
  network: string;
  transactionReference?: string;
}

function formatEth(value: string | number) {
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

function statusLabel(status: OrderStatus) {
  switch (status) {
    case "confirmed":
      return "Confirmado";
    case "declined":
      return "Recusado";
    default:
      return "Pendente";
  }
}

export default function OrderDetailsPage({
  orderId,
}: OrderDetailsPageProps) {
  const orderQuery = useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await api.get<Order>(
        `/orders/${encodeURIComponent(orderId)}`,
      );

      return response.data;
    },
    enabled: Boolean(orderId),
    retry: false,
  });

  if (orderQuery.isPending) {
    return (
      <main className="min-h-screen bg-[#110B08] px-5 py-12 text-[#E8D9CE]">
        <p>Carregando detalhes do pedido...</p>
      </main>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <main className="min-h-screen bg-[#110B08] px-5 py-12 text-[#E8D9CE]">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/pedidos"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#E99A4A] hover:underline"
          >
            <ArrowLeft size={16} />
            Voltar aos pedidos
          </Link>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <Package className="mb-4 text-[#E99A4A]" size={32} />

            <h1 className="text-2xl font-semibold">
              Não foi possível carregar o pedido
            </h1>

            <p className="mt-3 text-sm text-[#B7A79B]">
              O pedido pode não existir ou a API de pedidos ainda não
              estar configurada. Tente novamente mais tarde.
            </p>

            <button
              type="button"
              onClick={() => void orderQuery.refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E99A4A] px-4 py-2 font-medium text-[#110B08] hover:opacity-90"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </section>
        </div>
      </main>
    );
  }

  const order = orderQuery.data;

  return (
    <main className="min-h-screen bg-[#110B08] px-5 py-10 text-[#E8D9CE]">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/pedidos"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#E99A4A] hover:underline"
        >
          <ArrowLeft size={16} />
          Voltar aos pedidos
        </Link>

        <header className="mb-8">
          <p className="text-sm text-[#B7A79B]">Detalhes da compra</p>

          <h1 className="mt-2 break-all text-3xl font-bold">
            Pedido #{order.id}
          </h1>

          <p className="mt-2 text-sm text-[#B7A79B]">
            Criado em {formatDate(order.createdAt)}
          </p>

          <span className="mt-4 inline-flex rounded-full border border-[#E99A4A]/30 bg-[#E99A4A]/10 px-3 py-1 text-sm text-[#E99A4A]">
            {statusLabel(order.status)}
          </span>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <h2 className="mb-5 text-xl font-semibold">
            Itens do pedido
          </h2>

          <div className="divide-y divide-white/10">
            {order.items.map((item) => (
              <div
                key={item.nftId}
                className="flex items-center gap-4 py-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-xl bg-white/5 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium">{item.name}</h3>

                  <p className="mt-1 text-sm text-[#B7A79B]">
                    Quantidade: {item.quantity}
                  </p>

                  <p className="text-sm text-[#B7A79B]">
                    Unitário: {formatEth(item.unitPrice)}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  {formatEth(
                    Number(item.unitPrice) * item.quantity,
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#B7A79B]">Subtotal</span>
              <span>{formatEth(order.subtotal)}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#B7A79B]">Desconto</span>
              <span>- {formatEth(order.discount)}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#B7A79B]">Taxa de rede</span>
              <span>{formatEth(order.networkFee)}</span>
            </div>

            {order.couponCode && (
              <div className="flex justify-between gap-4">
                <span className="text-[#B7A79B]">Cupom</span>
                <span>{order.couponCode}</span>
              </div>
            )}

            <div className="flex justify-between gap-4 border-t border-white/10 pt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-[#E99A4A]">
                {formatEth(order.total)}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <h2 className="mb-4 text-xl font-semibold">Pagamento</h2>

          <dl className="space-y-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-[#B7A79B]">Carteira</dt>
              <dd>{order.walletType}</dd>
            </div>

            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-[#B7A79B]">Rede</dt>
              <dd>{order.network}</dd>
            </div>

            {order.transactionReference && (
              <div className="flex flex-col gap-2">
                <dt className="text-[#B7A79B]">
                  Referência da transação
                </dt>

                <dd className="break-all font-mono text-xs">
                  {order.transactionReference}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </main>
  );
}
