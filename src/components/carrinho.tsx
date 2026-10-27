import Image from "./ui/image";
import nft1 from "../assets/nft1.png";
import nft2 from "../assets/nft2.png";
import nft3 from "../assets/nft3.png";
import { Trash2 } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

export default function CarrinhoPage() {

    const navigate = useNavigate()
    function handleFinalizar() {
        navigate ({to: "/checkout"})
    }
  // Mantém os itens e os valores alinhados às três linhas de produtos da imagem de referência.
  const items = [
    {
      image: nft1,
      name: "Emerald Ape #042",
      id: "#0042",
      price: "1.19 ETH",
      quantity: 2,
      total: "2.38 ETH",
      alt: "Macaco usando óculos e jaqueta verde",
    },
    {
      image: nft2,
      name: "Violet Nomad #314",
      id: "#0009",
      price: "1.39 ETH",
      quantity: 6,
      total: "8.34 ETH",
      alt: "Macaco usando chapéu verde e moletom roxo",
    },
    {
      image: nft3,
      name: "Ivory Baron #088",
      id: "#0052",
      price: "1.79 ETH",
      quantity: 9,
      total: "16.11 ETH",
      alt: "Macaco de pelo escuro usando roupa clara",
    },
  ];

  return (
    // Substitui a tabela sem estrutura e ocupa a tela com o fundo escuro da referência.
    <main className=" bg-[#110B08] px-4 py-4 font-mono text-[#E8D9CE] sm:px-6">
      {/* Usa toda a largura disponível para que a tabela e o resumo ocupem o espaço da tela. */}
      <div className="w-full">

        {/* Divide o espaço disponível em duas colunas: tabela maior à esquerda e resumo à direita. */}
        <div className="grid grid-cols-2 items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-8 lg:gap-12">
          {/* Usa uma tabela semântica para alinhar cabeçalhos e células em colunas reais; em telas pequenas ela pode rolar horizontalmente. */}
          <section aria-label="NFTs no carrinho" className="min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-136 table-fixed border-separate border-spacing-y-2 text-left md:min-w-0">
                {/* Define larguras proporcionais para manter nome, preço, quantidade, total e ação alinhados. */}
                <colgroup>
                  <col className="w-[38%]" />
                  <col className="w-[16%]" />
                  <col className="w-[17%]" />
                  <col className="w-[17%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead>
                  <tr className="text-[10px] text-[#E8D9CE] sm:text-xs">
                    <th scope="col" className="border-b border-[#CFB28C]/25 pb-2 font-semibold">
                      NFTs
                    </th>
                    <th scope="col" className="border-b border-[#CFB28C]/25 pb-2 text-center font-normal">
                      Preço
                    </th>
                    <th scope="col" className="border-b border-[#CFB28C]/25 pb-2 text-center font-normal">
                      Edições
                    </th>
                    <th scope="col" className="border-b border-[#CFB28C]/25 pb-2 text-center font-normal">
                      Total
                    </th>
                    <th scope="col" className="border-b border-[#CFB28C]/25 pb-2" aria-label="Ações" />
                  </tr>
                </thead>
                {/* Mantém cada item em uma linha contínua e destaca as linhas em marrom escuro como na referência. */}
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="h-12.5 text-[9px] sm:text-[10px]">
                      {/* Agrupa imagem, nome e identificador na primeira célula sem quebrar a linha do produto. */}
                      <td className="rounded-l-sm bg-[#21150F] px-1 py-1 sm:px-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <Image
                            src={item.image}
                            alt={item.alt}
                            className="h-10 w-10 shrink-0 rounded-sm object-cover sm:h-12 sm:w-12"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#E8D9CE]">
                              {item.name}
                            </p>
                            <p className="truncate text-[8px] text-[#B39463] sm:text-[9px]">
                              ID do token: {item.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Centraliza preço e total dentro das colunas reservadas para eles. */}
                      <td className="bg-[#21150F] px-1 text-center text-[#B39463]">
                        {item.price}
                      </td>
                      {/* Alinha os controles de quantidade horizontalmente e preserva o tamanho compacto da referência. */}
                      <td className="bg-[#21150F] px-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${item.name}`}
                            className="flex h-5 w-3 items-center justify-center rounded-full bg-[#D98845] font-bold text-[#110B08] transition hover:bg-[#E8A15F]"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${item.name}`}
                            className="flex h-5 w-3 items-center justify-center rounded-full bg-[#D98845] font-bold text-[#110B08] transition hover:bg-[#E8A15F]"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="bg-[#21150F] px-1 text-center font-semibold text-[#D98845]">
                        {item.total}
                      </td>
                      {/* Coloca o ícone de remover no final da linha e arredonda a borda externa do card. */}
                      <td className="rounded-r-sm bg-[#21150F] px-1 text-center">
                        <button
                          type="button"
                          aria-label={`Remover ${item.name} do carrinho`}
                          className="inline-flex text-[#B39463] transition-colors hover:text-[#D98845]"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reproduz o painel lateral de resumo com campos, taxas e chamada principal de checkout. */}
          <aside className="w-full md:max-w-sm">
            <h2 className="border-b border-[#CFB28C]/25 pb-2 text-xs font-semibold text-[#E8D9CE]">
              Resumo da carteira
            </h2>

            {/* Coloca o campo promocional e botão lado a lado, com responsividade para telas estreitas. */}
            <form className="mt-3">
              <label
                htmlFor="promo-code"
                className="mb-1 block text-[9px] text-[#E8D9CE]"
              >
                Código promocional
              </label>
              <div className="flex">
                <input
                  id="promo-code"
                  type="text"
                  placeholder="Digite o código promocional..."
                  className="min-w-0 flex-1 border border-[#D98845]/60 bg-transparent px-2 py-1 text-[9px] text-[#E8D9CE] placeholder:text-[#B39463]/70 focus:outline-2 focus:outline-[#D98845]"
                />
                <button
                  type="button"
                  className="bg-[#D98845] px-3 text-[9px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F]"
                >
                  Aplicar
                </button>
              </div>
            </form>

            {/* Alinha descrições e valores para facilitar a leitura do resumo da compra. */}
            <dl className="mt-4 space-y-2 text-[9px]">
              <div className="flex justify-between gap-3">
                <dt>Subtotal</dt>
                <dd>26.83 ETH</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Desconto do lançamento</dt>
                <dd>(-) 00.00</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Taxa de rede</dt>
                <dd>0.016 ETH</dd>
              </div>
              <p className="text-right text-[8px] text-[#D98845]">
                Taxa estimada
              </p>
            </dl>

            {/* Dá ênfase ao total e ao botão de finalizar, mantendo o link secundário em laranja. */}
            <div className="mt-4 flex items-center justify-between text-[10px] font-bold">
              <span>Total</span>
              <span className="text-[#D98845]">26.846 ETH</span>
            </div>
            <button
              type="button"
              className="mt-3 w-full rounded-sm bg-[#D98845] px-3 py-2 text-[9px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F]" onClick={handleFinalizar}
            >
              Conectar e finalizar
            </button>
            <a
              href="/mercado"
              className="mt-2 block text-center text-[9px] text-[#D98845] transition-colors hover:text-[#E8A15F]"
            >
              Continuar explorando
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
