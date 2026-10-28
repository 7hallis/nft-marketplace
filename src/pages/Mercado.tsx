
import Header from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "@/components/ui/image";
import nft1 from "../assets/nft1.png";
import nft2 from "../assets/nft2.png";
import nft3 from "../assets/nft3.png";
import nft4 from "../assets/nft4.png";
import { Button } from "@/components/ui/button";
import { Heart, Search, X, Minus, Plus, ChevronLeft, ShoppingCart } from "lucide-react";
import { Footer } from "@/components/footer";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { nfts } from "@/data/nfts";

const thumbnails = [
  { image: nft1, alt: "Macaco usando óculos" },
  { image: nft2, alt: "Macaco com chapéu verde" },
  { image: nft3, alt: "Macaco com roupa clara" },
  { image: nft4, alt: "Macaco dourado com fones" },
];

const relatedNfts = nfts.filter(
  (nft) => nft.id !== "0042"
);

export default function Mercado() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(thumbnails[0]);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">(
    "details"
  );

function handleComprar() {
  addToCart({
    image: nft1,
    name: "Emerald Ape #042",
    id: "#0042",
    price: 1.19,
    quantity,
    alt: "Macaco usando óculos e jaqueta verde",
  });

  navigate({ to: "/carrinho" });
}

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#110B08] font-mono text-[#E8D9CE]">
      <div className="mx-auto w-full max-w-6xl px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
        <div className="hidden sm:block">
          <Header search={search} setSearch={setSearch} />
        </div>

        <Breadcrumb className="mb-4 hidden text-xs text-[#B39463] sm:mb-6 sm:block sm:text-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href="/" />}>
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Mercado</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Galeria e informações: empilhadas no celular, lado a lado no desktop. */}
        <div className="mx-auto grid w-full grid-cols-1 items-start gap-0 overflow-hidden rounded-none border border-transparent bg-[#241712] shadow-[0_12px_35px_rgba(0,0,0,0.25)] sm:gap-6 sm:rounded-2xl sm:border-amber-900/20 sm:bg-transparent sm:shadow-none md:grid-cols-[0.92fr_1fr] md:gap-6 lg:gap-8">
          <section className="relative flex min-w-0 flex-col gap-3 sm:flex-row sm:gap-4 md:gap-5">
            {/* Miniaturas ficam abaixo da imagem no celular e à esquerda no desktop. */}
            <div className="order-2 hidden max-w-full shrink-0 flex-row gap-2 overflow-x-auto pb-1 sm:order-1 sm:flex sm:flex-col sm:overflow-visible sm:pb-0">
              {thumbnails.map((thumbnail, index) => (
                <Button
                  key={thumbnail.alt}
                  type="button"
                  aria-label={`Ver imagem ${index + 1} do NFT`}
                  aria-pressed={selectedImage.image === thumbnail.image}
                  onClick={() => setSelectedImage(thumbnail)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border p-0 transition sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${
                    selectedImage.image === thumbnail.image
                      ? "border-[#D28A4C]"
                      : "border-amber-600/50 hover:border-[#D28A4C]"
                  }`}
                >
                  <Image
                    src={thumbnail.image}
                    alt={thumbnail.alt}
                    className="h-full w-full object-cover"
                  />
                </Button>
              ))}
            </div>

            <div className="order-1 relative min-w-0 flex-1 bg-[#1A100C] px-4 pb-0 pt-3 sm:order-2 sm:rounded-lg sm:border sm:border-amber-900/20 sm:p-3 lg:p-4">
              {/* Controles ficam fora da imagem no mobile, como na referência. */}
              <div className="mb-3 flex items-center justify-between sm:hidden">
                <button type="button" aria-label="Voltar" onClick={() => navigate({ to: "/" })} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#2B1B14] text-[#D8B58B]">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} aria-pressed={favorite} onClick={() => setFavorite((current) => !current)} className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#2B1B14] ${favorite ? "text-[#D98845]" : "text-[#D8B58B]"}`}>
                  <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
                </button>
              </div>
              <div className="relative aspect-[1.1/1] w-full overflow-hidden rounded-xl sm:aspect-square sm:rounded-lg">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.alt}
                  className="h-full w-full object-cover object-center"
                />

                <Button
                  type="button"
                  aria-label="Ampliar imagem"
                  onClick={() => setZoomOpen(true)}
                  className="absolute right-2 top-2 hidden rounded-full bg-black/50 p-2 text-white/80 backdrop-blur-md transition hover:text-white sm:flex"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          <section className="relative z-10 -mt-8 flex min-w-0 flex-col gap-4 rounded-t-2xl bg-[#241712] px-4 pb-6 pt-5 sm:mt-0 sm:rounded-none sm:bg-transparent sm:p-0 md:gap-4">
            <div className="flex items-center justify-between gap-2 sm:block">
              <h1 className="min-w-0 text-base font-bold tracking-wide text-white sm:text-xl md:text-2xl">
                Emerald Ape #042
              </h1>

              {/* No mobile, a avaliação fica à direita do nome do NFT. */}
              <div className="flex shrink-0 items-center gap-1 text-xs text-[#D28A4C] sm:hidden">
                <span aria-label="5 de 5 estrelas">★</span>
                <span className="text-[#E8D9CE]">4.8</span>
                <span className="text-[#B39463]">(19)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="hidden text-base font-semibold text-white sm:block sm:text-sm">
                1.19 ETH
              </div>

              <div className="hidden flex-wrap items-center gap-1 text-xs text-[#D28A4C] sm:flex">
                <span aria-label="5 de 5 estrelas">★</span>
                <span className="text-[#E8D9CE]">4.8</span>
                <span className="text-[#B39463]">(19)</span>
                <span className="ml-1 text-[#B39463]">19 avaliações de colecionadores</span>
              </div>
            </div>

            <p className="text-xs leading-[1.65] text-[#B39463] sm:text-sm sm:leading-relaxed">
              Um colecionável digital finalizado à mão da coleção Kurio
              Editions, verificado na Ethereum, com arte desbloqueável e acesso
              para colecionadores.
            </p>

            <div>
              <p className="mb-2 text-xs font-semibold text-white sm:text-sm">Edição:</p>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2 py-1 text-xs text-[#B39463]">
                  1/1
                </span>
                <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2 py-1 text-xs text-[#B39463]">
                  1/10
                </span>
                <span className="rounded-full border border-amber-600 bg-amber-900/30 px-2 py-1 text-xs font-bold text-[#D28A4C]">
                  1/50
                </span>
                <span className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2 py-1 text-xs text-[#B39463]">
                  ABERTA
                </span>
              </div>
            </div>

            <div className="mt-1 flex flex-col gap-2 break-words text-[11px] text-[#B39463] sm:text-sm">
              <p><span className="text-[#B39463]">ID do token:</span> #0042</p>
              <p><span className="text-[#B39463]">Coleção:</span> Kurio Apes</p>
              <p><span className="text-[#B39463]">Atributos:</span> Óculos, Esmeralda, Raro</p>
            </div>

            {/* Controles de compra compactos no mobile e originais no desktop. */}
            <div className="my-1 flex flex-col gap-4 rounded-2xl bg-[#21140F] p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:bg-transparent sm:p-0">
              <div className="flex items-center justify-between gap-3 sm:justify-start">
                <div className="flex items-center gap-2 sm:gap-2">
                  <span className="mr-1 text-[11px] text-[#B39463] sm:hidden">Qtd.</span>
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D98845] text-lg text-black transition hover:bg-[#c47738] disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="min-w-6 text-center font-semibold text-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  onClick={() =>
                    setQuantity((current) => Math.min(50, current + 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D98845] text-lg text-black transition hover:bg-[#c47738] sm:h-9 sm:w-9"
                >
                  <Plus className="h-4 w-4" />
                </button>
                </div>
                <span className="text-sm font-bold tracking-wide text-[#D98845] sm:hidden">{(1.19 * quantity).toFixed(2)} ETH</span>
              </div>

              <div className="flex items-center justify-between gap-3 sm:grid sm:grid-cols-1 sm:gap-2 min-[380px]:sm:grid-cols-2 md:flex">
                <Button
                  type="button"
                  className="w-full rounded-full bg-[#D98845] px-5 py-3 text-xs font-bold uppercase text-black transition hover:bg-[#c47738] sm:w-auto sm:rounded-md sm:py-2 sm:text-sm sm:px-7"
                  onClick={handleComprar}
                >
                  <span className="sm:hidden">Comprar NFT</span><span className="hidden sm:inline">Comprar</span>
                </Button>

                <Button type="button" aria-label="Abrir carrinho" onClick={handleComprar} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#352117] p-0 text-[#B39463] hover:bg-[#4A2C1B] sm:hidden">
                  <ShoppingCart className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  aria-pressed={favorite}
                  onClick={() => setFavorite((current) => !current)}
                  className={`hidden w-full items-center justify-center gap-2 rounded-md border px-3 py-2 font-semibold transition sm:flex sm:w-auto ${
                    favorite
                      ? "border-[#D98845] bg-[#D98845]/10 text-[#D98845]"
                      : "border-[#D98845] text-[#D98845] hover:bg-[#D98845]/10"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${favorite ? "fill-current" : ""}`}
                  />
                  {favorite ? "Favoritado" : "Favoritar"}
                </Button>
              </div>
            </div>

            <div className="mt-1 hidden flex-wrap items-center gap-3 text-xs text-[#B39463] sm:flex sm:text-sm">
              <span className="font-semibold text-white">
                Compartilhar este NFT:
              </span>
              <a
                href="#"
                aria-label="Compartilhar no LinkedIn"
                className="transition hover:text-white"
              >
                in
              </a>
              <a
                href="#"
                aria-label="Compartilhar por e-mail"
                className="transition hover:text-white"
              >
                ✉
              </a>
              <a
                href="#"
                aria-label="Compartilhar no Twitter"
                className="transition hover:text-white"
              >
                🐦
              </a>
            </div>
          </section>
        </div>

        {/* Detalhes e avaliações. */}
        <section className="hidden sm:mx-0 sm:mt-10 sm:block sm:w-full">
          <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-[#CFB28C]/30 text-xs sm:gap-6 sm:text-sm">
            <button
              type="button"
              aria-pressed={activeTab === "details"}
              onClick={() => setActiveTab("details")}
              className={`-mb-px border-b-2 pb-2 transition ${
                activeTab === "details"
                  ? "border-[#D98845] font-bold text-[#D98845]"
                  : "border-transparent text-[#E8D9CE] hover:text-[#D98845]"
              }`}
            >
              Detalhes do NFT
            </button>

            <button
              type="button"
              aria-pressed={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
              className={`-mb-px border-b-2 pb-2 transition ${
                activeTab === "reviews"
                  ? "border-[#D98845] font-bold text-[#D98845]"
                  : "border-transparent text-[#E8D9CE] hover:text-[#D98845]"
              }`}
            >
              Avaliações de colecionadores (19)
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="break-words pt-4 text-xs leading-[1.7] text-[#B39463] sm:pt-5 sm:text-sm">
              <p className="mb-5">
                Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da
                coleção Kurio Editions. Cada atributo fica armazenado nos
                metadados do token e verificado na Ethereum. A obra explora
                identidade, movimento e luz em um mundo digital sem fronteiras.
              </p>

              <p className="mb-4">
                A propriedade inclui a arte em alta resolução, lançamentos
                exclusivos para colecionadores e um registro permanente de
                procedência registrada na rede. Nova Sato recebe 5% de direitos
                autorais nas vendas secundárias, apoiando novos trabalhos e
                lançamentos da comunidade.
              </p>

              <div className="space-y-3">
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
                  <p className="font-bold text-[#F5F1EB]">
                    Direitos autorais:
                  </p>
                  <p>
                    0x7A42...19E8 • Contrato inteligente ERC-721 verificado.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-5 text-sm text-[#B39463]">
              <p className="font-bold text-white">Avaliações de colecionadores</p>
              <p className="mt-2">
                Este NFT possui 19 avaliações de colecionadores.
              </p>
              <div className="mt-3 text-[#D98845]" aria-label="5 de 5 estrelas">
                ★★★★★ <span className="text-xs text-[#B39463]">5/5</span>
              </div>
            </div>
          )}
        </section>

        {/* NFTs relacionados. */}
        <section className="hidden sm:mx-0 sm:mt-10 sm:block sm:w-full">
          <div className="border-b border-[#CFB28C]/30">
            <h2 className="pb-2 text-xs font-bold text-[#D98845] sm:text-sm">
              Mais desta coleção
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {relatedNfts.map((item) => (
          <article
              key={item.id}
              role="link"
              tabIndex={0}
              onClick={() =>
                navigate({
                  to: "/nft/$nftId",
                  params: { nftId: item.id },
                })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate({
                    to: "/nft/$nftId",
                    params: { nftId: item.id },
                  });
                }
              }}
              className="min-w-0 cursor-pointer"
            >
              <div className="aspect-square overflow-hidden rounded-xl border border-amber-900/30 bg-[#1A100C]">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

                <div className="pt-2 text-[10px] leading-tight text-[#E8D9CE] sm:text-xs">
                  <p className="truncate">{item.name}</p>
                  <p className="mt-1 font-bold text-[#D98845]">{item.price}</p>
                </div>
              </article>
            ))}
          </div>

          <div
            className="mt-4 flex justify-center gap-1.5"
            aria-label="Página 2 de 3"
          >
            <span className="h-2 w-2 rounded-full border border-[#D98845]" />
            <span className="h-2 w-2 rounded-full bg-[#D98845]" />
            <span className="h-2 w-2 rounded-full border border-[#D98845]" />
          </div>
        </section>

        <div className="hidden sm:block">
          <Footer />
        </div>
      </div>

      {/* Visualização ampliada da imagem selecionada. */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada do NFT"
        >
          <Button
            type="button"
            aria-label="Fechar imagem ampliada"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
          >
            <X className="h-5 w-5" />
          </Button>

          <div
            className="relative max-h-[90vh] w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.image}
              alt={selectedImage.alt}
              className="max-h-[85vh] w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
