import Header from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Image from "@/components/ui/image";
import nft1 from "../assets/nft1.png";
import nft2 from "../assets/nft2.png";
import nft3 from "../assets/nft3.png";
import nft4 from "../assets/nft4.png";
import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import { Footer } from "@/components/footer";
import { useNavigate } from "@tanstack/react-router";




export default function Mercado() {
    const navigate = useNavigate()
    function handleComprar() {
        navigate({to: "/carrinho"})
    }
    
  return (
    <main className="min-h-screen bg-[#110B08] font-mono text-[#E8D9CE]">
      <div className="mx-auto max-w-6xl px-4 py-6">
      <Header />
        <Breadcrumb className="mb-3 text-sm text-[#B39463]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href="/" />}>Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Mercado</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[0.92fr_1fr] md:gap-6">
          <section className="flex gap-5">
            <div className="flex shrink-0 flex-col gap-3">
              {[1, 2, 3, 4].map((thumbnail) => (
                <Button
                  key={thumbnail}
                  aria-label={`Ver imagem ${thumbnail} do NFT`}
                  className="h-20 w-20 overflow-hidden rounded-md border border-amber-600/50 p-0 transition hover:border-[#D28A4C]"
                >
                  <Image
                    src={nft1}
                    alt="Colecionável digital de um macaco usando óculos"
                    className="h-full w-full object-cover"
                  />
                </Button>
              ))}
            </div>

            <div className="relative min-w-0 flex-1 rounded-lg border border-amber-900/20 bg-[#1A100C] p-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={nft1}
                  alt="Colecionável digital de um macaco usando óculos"
                  className="h-full w-full object-cover"
                />
                <Button
                  aria-label="Ampliar imagem"
                  className="absolute right-2 top-2 rounded-full bg-black/40 p-2 text-white/80 backdrop-blur-md transition hover:text-white"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold tracking-wide text-white">
              Emerald Ape #042
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <div className="text-sm font-semibold text-white">1.19 ETH</div>
              <div className="flex items-center gap-1 text-xs text-[#D28A4C]">
                <span aria-label="5 de 5 estrelas">★★★★★</span>
                <span className="ml-1 text-[#B39463]">
                  19 avaliações de colecionadores
                </span>
              </div>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-[#B39463]">
              Um colecionável digital finalizado à mão da coleção Kurio
              Editions, verificado na Ethereum, com arte desbloqueável e acesso
              para colecionadores.
            </p>

            <div>
              <p className="mb-2 text-sm font-semibold text-white">Edição:</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2 py-0.5 text-xs text-[#B39463]">
                  1/1
                </span>
                <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2 py-0.5 text-xs text-[#B39463]">
                  1/10
                </span>
                <span className="rounded-full border border-amber-600 bg-amber-900/30 px-2 py-0.5 text-xs font-bold text-[#D28A4C]">
                  1/50
                </span>
                <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2 py-0.5 text-xs text-[#B39463]">
                  ABERTA
                </span>
              </div>
            </div>

            <div className="my-1 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  aria-label="Diminuir quantidade"
                  className="flex h-9 w-8 items-center justify-center rounded-full bg-[#D98845] text-lg text-black transition hover:bg-[#c47738]"
                >
                  -
                </button>
                <span className="px-1 font-semibold text-white">1</span>
                <button
                  aria-label="Aumentar quantidade"
                  className="flex h-9 w-8 items-center justify-center rounded-full bg-[#D98845] text-lg text-black transition hover:bg-[#c47738]"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button className="rounded-md bg-[#D98845] px-7 py-2 font-bold uppercase text-black transition hover:bg-[#c47738]" onClick={handleComprar}>
                  Comprar
                </Button>
                <Button className="flex items-center gap-2 rounded-md border border-[#D98845] px-3 py-2 font-semibold text-[#D98845] transition hover:bg-[#D98845]/10">
                  <Heart className="h-4 w-4" />
                  Favoritar
                </Button>
              </div>
            </div>

            <div className="mt-1 flex flex-col gap-1 text-sm text-[#B39463]">
              <p>
                <span className="text-[#B39463]">ID do token:</span> #0042
              </p>
              <p>
                <span className="text-[#B39463]">Coleção:</span> Kurio Apes
              </p>
              <p>
                <span className="text-[#B39463]">Atributos:</span> Óculos,
                Esmeralda, Raro
              </p>
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-[#B39463]">
              <span className="font-semibold text-white">
                Compartilhar este NFT:
              </span>
              <a href="#" aria-label="Compartilhar no LinkedIn" className="transition hover:text-white">
                in
              </a>
              <a href="#" aria-label="Compartilhar por e-mail" className="transition hover:text-white">
                ✉
              </a>
              <a href="#" aria-label="Compartilhar no Twitter" className="transition hover:text-white">
                🐦
              </a>
            </div>
          </section>
       
        </div>
          <section className="mt-10 w-full">
            {/* Indica a aba ativa com destaque laranja e mantém a linha divisória da referência. */}
            <div className="flex w-full gap-6 border-b border-[#CFB28C]/30 text-xs sm:text-sm">
              <a
                href="#"
                aria-current="page"
                className="-mb-px border-b-2 border-[#D98845] px-0 pb-1 font-bold text-[#D98845]"
              >
                Detalhes do NFT
              </a>
              <a
                href="#"
                className="pb-1 text-[#E8D9CE] transition hover:text-[#D98845]"
              >
                Avaliações de colecionadores (19)
              </a>
            </div>

            {/* Usa apenas classes Tailwind para reproduzir o texto monoespaçado, alinhado à esquerda e compacto. */}
            <div className="pt-2 text-xs leading-[1.6] text-[#B39463]">
              {/* Separa os dois parágrafos para reproduzir a distância visível na imagem. */}
              <p className="mb-5">
                Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da
                coleção Kurio Editions. Cada atributo fica armazenado nos
                metadados do token e verificado na Ethereum. A obra explora
                identidade, movimento e luz em um mundo digital sem fronteiras.
              </p>
              <p className="mb-3">
                A propriedade inclui a arte em alta resolução, lançamentos
                exclusivos para colecionadores e um registro permanente de
                procedência registrada na rede. Nova Sato recebe 5% de direitos
                autorais nas vendas secundárias, apoiando novos trabalhos e
                lançamentos da comunidade.
              </p>

              {/* Agrupa cada título em negrito com seu valor para espelhar os metadados da referência. */}
              <div className="space-y-2">
                <div>
                  <p className="font-bold text-[#F5F1EB]">Rede:</p>
                  <p>
                    Cunhado na Ethereum com procedência imutável e metadados
                    armazenados no IPFS.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[#F5F1EB]">Contrato:</p>
                  <p>
                    Direitos autorais do criador: 5% nas vendas secundárias,
                    pagos automaticamente pelos mercados compatíveis.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[#F5F1EB]">Direitos autorais:</p>
                  <p>
                    0x7A42...19E8 • Contrato inteligente ERC-721 verificado.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Troca classes inválidas por utilitários Tailwind e reproduz o título com divisor da imagem. */}
          <section className="mt-10 w-full">
            <div className="border-b border-[#CFB28C]/30">
              <h2 className="pb-1 text-xs font-bold text-[#D98845] sm:text-sm">
                Mais desta coleção
              </h2>
            </div>

            {/* Exibe os cinco NFTs em colunas responsivas, com rolagem horizontal em telas estreitas. */}
            <div className="grid grid-cols-2 gap-4 overflow-x-auto pt-5 sm:grid-cols-3 lg:grid-cols-5">
              {[
                {
                  image: nft2,
                  name: "Cosmic Bloom #118",
                  price: "1.29 ETH",
                  alt: "Macaco usando chapéu verde e moletom roxo",
                },
                {
                  image: nft2,
                  name: "Violet #035",
                  price: "1.39 ETH",
                  alt: "Macaco usando chapéu verde e moletom roxo",
                },
                {
                  image: nft3,
                  name: "Ivory Baron #088",
                  price: "1.79 ETH",
                  alt: "Macaco de pelo escuro usando roupa clara",
                },
                {
                  image: nft4,
                  name: "Golden Beat #207",
                  price: "0.99 ETH",
                  alt: "Macaco dourado usando fones de ouvido",
                },
                {
                  image: nft4,
                  name: "Golden Signal #160",
                  price: "0.39 ETH",
                  alt: "Macaco dourado usando fones de ouvido",
                },
              ].map((item) => (
                <article key={item.name} className="min-w-0">
                  {/* Mantém o fundo escuro e a imagem vertical com margem interna como na referência. */}
                  <div className="bg-[#241612] p-3">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      className="aspect-ratio: 4/5 w-full rounded-lg object-cover"
                    />
                  </div>
                  {/* Mantém nome e preço compactos, usando laranja para destacar o valor. */}
                  <div className="pt-2 text-[10px] leading-tight text-[#E8D9CE] sm:text-xs">
                    <p className="truncate">{item.name}</p>
                    <p className="mt-0.5 font-bold text-[#D98845]">{item.price}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Os indicadores centralizados reproduzem os pontos de paginação visíveis sob os cards. */}
            <div className="mt-4 flex justify-center gap-1.5" aria-label="Página 2 de 3">
              <span className="h-2 w-2 rounded-full border border-[#D98845]" />
              <span className="h-2 w-2 rounded-full bg-[#D98845]" />
              <span className="h-2 w-2 rounded-full border border-[#D98845]" />
            </div>
          </section>
      <Footer/>
      </div>
    </main>
  );
}