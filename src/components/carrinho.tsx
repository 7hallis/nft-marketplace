
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
  const { items, removeFromCart, updateQuantity } = useCart();

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

  const total =
    Math.max(0, subtotal - discount) +
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
    <section className="mx-auto min-w-0 w-full max-w-[1200px] rounded-[28px] bg-[#1A100C] px-3 py-4 font-mono text-[#E8D9CE] sm:rounded-none sm:bg-[#110B08] sm:px-0 sm:py-6">
      <div className="mx-auto grid w-full min-w-0 grid-cols-1 items-start gap-3 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:gap-8">
        <section aria-label="NFTs no carrinho" className="min-w-0">
          <h2 className="mb-3 text-center text-[13px] font-bold text-white sm:mb-4 sm:hidden">
            Carrinho de NFTs
          </h2>

          {items.length > 0 ? (
            <>
              {/* Tabela para desktop */}
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
              <div className="space-y-2 sm:hidden">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-[#CFB28C]/10 bg-[#21150F] p-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        className="h-[58px] w-[58px] shrink-0 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[10px] font-semibold leading-tight text-white">
                          {item.name}
                        </h3>

                        <p className="mt-1 truncate text-[9px] leading-tight text-[#B39463]">
                          Token: {item.id}
                        </p>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold text-[#D98845]">
                            {formatEth(item.price)}
                          </span>

                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              aria-label={`Diminuir quantidade de ${item.name}`}
                              disabled={item.quantity <= 1}
                              onClick={() => handleQuantity(item.id, -1)}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#39271D] text-[10px] text-[#E8D9CE] disabled:opacity-40"
                            >
                              −
                            </button>

                            <span className="min-w-3 text-center text-[10px]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Aumentar quantidade de ${item.name}`}
                              disabled={item.quantity >= 50}
                              onClick={() => handleQuantity(item.id, 1)}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#39271D] text-[10px] text-[#E8D9CE] disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label={`Remover ${item.name} do carrinho`}
                        onClick={() => handleRemove(item.id)}
                        className="shrink-0 self-start p-1 text-[#B39463] hover:text-[#D98845]"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
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
        <aside className="w-full rounded-[22px] border border-[#CFB28C]/10 bg-[#1A100C] p-3 sm:rounded-md sm:border-[#CFB28C]/15 sm:p-4 lg:sticky lg:top-6 lg:p-5">
          <h2 className="hidden border-b border-[#CFB28C]/25 pb-3 text-sm font-semibold text-white sm:block">
            Resumo da carteira
          </h2>

          <form onSubmit={handleApplyPromo} className="mt-0 sm:mt-4">
            <label
              htmlFor="promo-code"
              className="mb-2 hidden text-[10px] text-[#E8D9CE] sm:block"
            >
              Código promocional
            </label>

            <div className="flex min-w-0">
              <input
                id="promo-code"
                type="text"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Digite o código promocional..."
                className="min-w-0 flex-1 rounded-l-full border border-[#D98845]/30 bg-[#21150F] px-3 py-2 text-[9px] text-[#E8D9CE] placeholder:text-[#B39463]/70 focus:outline-2 focus:outline-[#D98845] sm:rounded-none sm:text-xs"
              />

              <button
                type="submit"
                className="shrink-0 rounded-r-full bg-[#B9793E] px-3 text-[10px] font-bold text-white transition-colors hover:bg-[#E8A15F] sm:rounded-none sm:text-xs sm:text-[#110B08]"
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

          <dl className="mt-3 space-y-1.5 text-[10px] sm:mt-5 sm:space-y-3 sm:text-xs">
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
              <dt className="text-[#B39463]">
                Taxa de rede{" "}
                <span className="hidden sm:inline">estimada</span>
              </dt>
              <dd className="text-right">
                {items.length > 0
                  ? formatEth(NETWORK_FEE)
                  : formatEth(0)}
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#CFB28C]/25 pt-3 text-xs font-bold sm:mt-5 sm:pt-4 sm:text-sm">
            <span>Total</span>
            <span className="text-right text-[#D98845]">
              {formatEth(total)}
            </span>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={handleFinalizar}
            className="mt-3 w-full rounded-full bg-[#C17C42] px-3 py-3 text-[10px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-5 sm:rounded-sm sm:text-xs"
          >
            Conectar e finalizar
          </button>
        </aside>
      </div>
    </section>
  );
}
