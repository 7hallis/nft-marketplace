
import Image from "./ui/image";
import { Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/contexts/CartContext";
import { useMemo, useState, type FormEvent } from "react";

const NETWORK_FEE = 0.016;

function formatEth(value: number) {
  return `${value.toFixed(3)} ETH`;
}

export default function CarrinhoPage() {
const navigate = useNavigate();

const {
  items,
  removeFromCart,
  updateQuantity,
} = useCart();

const [promoCode, setPromoCode] = useState("");
const [promoMessage, setPromoMessage] = useState("");
const [discount, setDiscount] = useState(0);

const subtotal = useMemo(
  () =>
    items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  [items]
);

const total = Math.max(0, subtotal - discount) +
  (items.length > 0 ? NETWORK_FEE : 0);

function handleQuantity(id: string, change: number) {
  const item = items.find((product) => product.id === id);

  if (!item) return;

  updateQuantity(id, item.quantity + change);
}

function handleRemove(id: string) {
  removeFromCart(id);
  setDiscount(0);
  setPromoMessage("");
}

function handleApplyPromo(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (items.length === 0) {
    setPromoMessage("Adicione um NFT antes de aplicar um cupom.");
    return;
  }

  if (promoCode.trim().toUpperCase() === "KURIO10") {
    setDiscount(subtotal * 0.1);
    setPromoMessage("Cupom KURIO10 aplicado: 10% de desconto.");
  } else {
    setDiscount(0);
    setPromoMessage("Código inválido. Tente KURIO10.");
  }
}

function handleFinalizar() {
  if (items.length === 0) return;

  navigate({ to: "/checkout" });
}

  return (
    <section className="min-w-0 bg-[#110B08] py-4 font-mono text-[#E8D9CE] sm:py-6">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:gap-8">
        {/* Lista de produtos */}
        <section aria-label="NFTs no carrinho" className="min-w-0">
          <h2 className="mb-4 text-sm font-bold text-white">
            Meu carrinho ({items.reduce((sum, item) => sum + item.quantity, 0)})
          </h2>

          {items.length > 0 ? (
            <>
              {/* Tabela para telas médias e grandes */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[480px] table-fixed border-separate border-spacing-y-2 text-left">
                  <colgroup>
                    <col className="w-[38%]" />
                    <col className="w-[16%]" />
                    <col className="w-[17%]" />
                    <col className="w-[19%]" />
                    <col className="w-[10%]" />
                  </colgroup>

                  <thead>
                    <tr className="text-[10px] text-[#E8D9CE] md:text-xs">
                      <th className="border-b border-[#CFB28C]/25 pb-2 font-semibold">
                        NFTs
                      </th>
                      <th className="border-b border-[#CFB28C]/25 pb-2 text-center font-normal">
                        Preço
                      </th>
                      <th className="border-b border-[#CFB28C]/25 pb-2 text-center font-normal">
                        Edições
                      </th>
                      <th className="border-b border-[#CFB28C]/25 pb-2 text-center font-normal">
                        Total
                      </th>
                      <th
                        className="border-b border-[#CFB28C]/25 pb-2"
                        aria-label="Ações"
                      />
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="text-[10px]">
                        <td className="rounded-l-sm bg-[#21150F] px-2 py-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <Image
                              src={item.image}
                              alt={item.alt}
                              className="h-10 w-10 shrink-0 rounded-sm object-cover md:h-12 md:w-12"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#E8D9CE]">
                                {item.name}
                              </p>
                              <p className="text-[9px] text-[#B39463]">
                                Token: {item.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="bg-[#21150F] px-1 text-center text-[#B39463]">
                          {formatEth(item.price)}
                        </td>

                        <td className="bg-[#21150F] px-1">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              aria-label={`Diminuir quantidade de ${item.name}`}
                              onClick={() => handleQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D98845] text-[#110B08] hover:bg-[#E8A15F] disabled:opacity-40"
                            >
                              -
                            </button>

                            <span className="min-w-4 text-center">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Aumentar quantidade de ${item.name}`}
                              onClick={() => handleQuantity(item.id, 1)}
                              disabled={item.quantity >= 50}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D98845] text-[#110B08] hover:bg-[#E8A15F] disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="bg-[#21150F] px-1 text-center font-semibold text-[#D98845]">
                          {formatEth(item.price * item.quantity)}
                        </td>

                        <td className="rounded-r-sm bg-[#21150F] px-1 text-center">
                          <button
                            type="button"
                            aria-label={`Remover ${item.name} do carrinho`}
                            onClick={() => handleRemove(item.id)}
                            className="inline-flex text-[#B39463] transition-colors hover:text-[#D98845]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards para celulares */}
              <div className="space-y-3 sm:hidden">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-md border border-[#CFB28C]/15 bg-[#21150F] p-3"
                  >
                    <div className="flex gap-3">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        className="h-20 w-20 shrink-0 rounded-md object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="break-words text-xs font-semibold text-white">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-[9px] text-[#B39463]">
                              Token: {item.id}
                            </p>
                          </div>

                          <button
                            type="button"
                            aria-label={`Remover ${item.name} do carrinho`}
                            onClick={() => handleRemove(item.id)}
                            className="shrink-0 p-1 text-[#B39463] hover:text-[#D98845]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="mt-2 text-[10px] text-[#B39463]">
                          {formatEth(item.price)} por edição
                        </p>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Diminuir quantidade de ${item.name}`}
                              disabled={item.quantity <= 1}
                              onClick={() => handleQuantity(item.id, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D98845] text-[#110B08] disabled:opacity-40"
                            >
                              -
                            </button>

                            <span className="text-xs">{item.quantity}</span>

                            <button
                              type="button"
                              aria-label={`Aumentar quantidade de ${item.name}`}
                              disabled={item.quantity >= 50}
                              onClick={() => handleQuantity(item.id, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D98845] text-[#110B08] disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs font-bold text-[#D98845]">
                            {formatEth(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-md border border-[#CFB28C]/20 bg-[#21150F] px-4 py-10 text-center">
              <p className="text-sm font-bold text-white">
                Seu carrinho está vazio
              </p>
              <p className="mt-2 text-xs text-[#B39463]">
                Explore o mercado e encontre seu próximo NFT.
              </p>
              <a
                href="/mercado"
                className="mt-4 inline-block text-xs font-bold text-[#D98845] hover:text-[#E8A15F]"
              >
                Explorar mercado
              </a>
            </div>
          )}
        </section>

        {/* Resumo do pedido */}
        <aside className="w-full rounded-md border border-[#CFB28C]/15 bg-[#1A100C] p-4 lg:sticky lg:top-6 lg:p-5">
          <h2 className="border-b border-[#CFB28C]/25 pb-3 text-sm font-semibold text-white">
            Resumo da carteira
          </h2>

          <form onSubmit={handleApplyPromo} className="mt-4">
            <label
              htmlFor="promo-code"
              className="mb-2 block text-[10px] text-[#E8D9CE]"
            >
              Código promocional
            </label>

            <div className="flex min-w-0">
              <input
                id="promo-code"
                type="text"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Digite seu cupom..."
                className="min-w-0 flex-1 border border-[#D98845]/60 bg-transparent px-2 py-2 text-xs text-[#E8D9CE] placeholder:text-[#B39463]/70 focus:outline-2 focus:outline-[#D98845]"
              />

              <button
                type="submit"
                className="shrink-0 bg-[#D98845] px-3 text-xs font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F]"
              >
                Aplicar
              </button>
            </div>

            {promoMessage && (
              <p
                aria-live="polite"
                className="mt-2 text-[10px] text-[#D98845]"
              >
                {promoMessage}
              </p>
            )}
          </form>

          <dl className="mt-5 space-y-3 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-[#B39463]">Subtotal</dt>
              <dd className="text-right">{formatEth(subtotal)}</dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-[#B39463]">Desconto</dt>
              <dd className="text-right text-[#D98845]">
                - {formatEth(discount)}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-[#B39463]">Taxa de rede estimada</dt>
              <dd className="text-right">
                {items.length > 0 ? formatEth(NETWORK_FEE) : formatEth(0)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#CFB28C]/25 pt-4 text-sm font-bold">
            <span>Total</span>
            <span className="text-right text-[#D98845]">
              {formatEth(total)}
            </span>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={handleFinalizar}
            className="mt-5 w-full rounded-sm bg-[#D98845] px-3 py-3 text-xs font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Conectar e finalizar
          </button>

          <a
            href="/mercado"
            className="mt-3 block text-center text-xs text-[#D98845] transition-colors hover:text-[#E8A15F]"
          >
            Continuar explorando
          </a>
        </aside>
      </div>
    </section>
  );
}
