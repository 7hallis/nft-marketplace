
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer"
import { nfts } from "@/data/nfts";
import Header from "../header";

type NFTDetailsData = {
  id: string;
  name: string;
  image: string;
  price: number;
  alt: string;
  collection: string;
};

type NFTDetailsProps = {
  nft: NFTDetailsData;
  onComprar: (quantity: number) => void;
};

type NFTTab = "details" | "reviews";

export default function NFTDetails({
  nft,
  onComprar,
}: NFTDetailsProps) {
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NFTTab>("details");

  const thumbnails = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => ({
        image: nft.image,
        alt: `${nft.alt} — imagem ${index + 1}`,
      })),
    [nft.image, nft.alt],
  );

  const [selectedImage, setSelectedImage] = useState(thumbnails[0]);

  const relatedNfts = useMemo(
    () => nfts.filter((item) => item.id !== nft.id),
    [nft.id],
  );

  const normalizeId = (id: string) =>
    String(id).replace(/^#/, "").trim().replace(/^0+/, "") || "0";

  const tokenId = normalizeId(nft.id).padStart(4, "0");
  const totalPrice = nft.price * quantity;

  const handleComprar = () => {
    onComprar(quantity);
  };

  const handleNavigateToNft = (id: string) => {
    navigate({
      to: "/nft/$nftId",
      params: { nftId: normalizeId(id) },
    });
  };

  const handleShare = (platform: "linkedin" | "email" | "twitter") => {
    const url = window.location.href;
    const title = encodeURIComponent(nft.name);
    const encodedUrl = encodeURIComponent(url);

    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${encodedUrl}`,
      email: `mailto:?subject=${title}&body=${encodedUrl}`,
    };

    if (platform === "email") {
      window.location.href = shareUrls.email;
      return;
    }

    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };
    const [search, setSearch] = useState("");
  return (
    <>
        <Header search={search} setSearch={setSearch} />
      <div className="mx-auto mt-3 grid w-full grid-cols-1 items-start gap-0 overflow-hidden rounded-none border border-transparent bg-[#241712] shadow-[0_12px_35px_rgba(0,0,0,0.25)] sm:gap-6 sm:rounded-2xl sm:border-amber-900/20 sm:bg-transparent sm:shadow-none md:grid-cols-[0.92fr_1fr] md:gap-6 lg:gap-8">
        {/* Galeria do NFT */}
        <section className="relative flex min-w-0 flex-col gap-3 sm:flex-row sm:gap-4 md:gap-5">
          <div className="order-2 flex max-w-full shrink-0 flex-row gap-2 overflow-x-auto px-4 pb-3 sm:order-1 sm:flex-col sm:overflow-visible sm:px-0 sm:pb-0">
            {thumbnails.map((thumbnail, index) => (
              <Button
                key={`${nft.id}-thumbnail-${index}`}
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
                <img
                  src={thumbnail.image}
                  alt={thumbnail.alt}
                  className="h-full w-full object-cover"
                />
              </Button>
            ))}
          </div>

          <div className="order-1 relative min-w-0 flex-1 bg-[#1A100C] px-4 pb-0 pt-3 sm:order-2 sm:rounded-lg sm:border sm:border-amber-900/20 sm:p-3 lg:p-4">
            {/* Controles mobile */}
            <div className="mb-3 flex items-center justify-between sm:hidden">
              <button
                type="button"
                aria-label="Voltar"
                onClick={() => navigate({ to: "/" })}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#2B1B14] text-[#D8B58B]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label={
                  favorite
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
                aria-pressed={favorite}
                onClick={() => setFavorite((current) => !current)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#2B1B14] ${
                  favorite ? "text-[#D98845]" : "text-[#D8B58B]"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    favorite ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>

            <div className="relative aspect-[1.1/1] w-full overflow-hidden rounded-xl sm:aspect-square sm:rounded-lg">
              <img
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

        {/* Informações e compra */}
        <section className="relative z-10 -mt-2 flex min-w-0 flex-col gap-4 rounded-t-2xl bg-[#241712] px-4 pb-6 pt-5 sm:mt-0 sm:rounded-none sm:bg-transparent sm:p-0 md:gap-4">
          <div className="flex items-center justify-between gap-2 sm:block">
            <h1 className="min-w-0 text-base font-bold tracking-wide text-white sm:text-xl md:text-2xl">
              {nft.name}
            </h1>

            <div className="flex shrink-0 items-center gap-1 text-xs text-[#D28A4C] sm:hidden">
              <span aria-hidden="true">★</span>
              <span className="text-[#E8D9CE]">4.8</span>
              <span className="text-[#B39463]">(19)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="hidden text-base font-semibold text-white sm:block sm:text-sm">
              {nft.price.toFixed(2)} ETH
            </div>

            <div className="hidden flex-wrap items-center gap-1 text-xs text-[#D28A4C] sm:flex">
              <span aria-hidden="true">★</span>
              <span className="text-[#E8D9CE]">4.8</span>
              <span className="text-[#B39463]">(19)</span>
              <span className="ml-1 text-[#B39463]">
                19 avaliações de colecionadores
              </span>
            </div>
          </div>

          <p className="text-xs leading-[1.65] text-[#B39463] sm:text-sm sm:leading-relaxed">
            Um colecionável digital da coleção {nft.collection}, apresentado
            com arte exclusiva para colecionadores. Consulte os detalhes e
            atributos da obra antes de realizar sua compra.
          </p>

          {/* Edições ilustrativas */}
          <div>
            <p className="mb-2 text-xs font-semibold text-white sm:text-sm">
              Edição:
            </p>

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
            <p>
              <span className="text-[#B39463]">ID do token:</span> #{tokenId}
            </p>
            <p>
              <span className="text-[#B39463]">Coleção:</span> {nft.collection}
            </p>
            <p>
              <span className="text-[#B39463]">Atributos:</span>{" "}
              Consulte os atributos da obra
            </p>
          </div>

          {/* Quantidade e ações */}
          <div className="my-1 flex flex-col gap-4 rounded-2xl bg-[#21140F] p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:bg-transparent sm:p-0">
            <div className="flex items-center justify-between gap-3 sm:justify-start">
              <div className="flex items-center gap-2">
                <span className="mr-1 text-[11px] text-[#B39463] sm:hidden">
                  Qtd.
                </span>

                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D98845] text-black transition hover:bg-[#c47738] disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="min-w-6 text-center font-semibold text-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  disabled={quantity >= 50}
                  onClick={() =>
                    setQuantity((current) => Math.min(50, current + 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D98845] text-black transition hover:bg-[#c47738] disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <span className="text-sm font-bold tracking-wide text-[#D98845] sm:hidden">
                {totalPrice.toFixed(2)} ETH
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 sm:grid sm:grid-cols-1 sm:gap-2 min-[380px]:sm:grid-cols-2 md:flex">
              <Button
                type="button"
                onClick={handleComprar}
                className="w-full rounded-full bg-[#D98845] px-5 py-3 text-xs font-bold uppercase text-black transition hover:bg-[#c47738] sm:w-auto sm:rounded-md sm:px-7 sm:py-2 sm:text-sm"
              >
                <span className="sm:hidden">Comprar NFT</span>
                <span className="hidden sm:inline">Comprar</span>
              </Button>

              <Button
                type="button"
                aria-label="Adicionar ao carrinho"
                onClick={handleComprar}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#352117] p-0 text-[#B39463] hover:bg-[#4A2C1B] sm:hidden"
              >
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
                  className={`h-4 w-4 ${
                    favorite ? "fill-current" : ""
                  }`}
                />
                {favorite ? "Favoritado" : "Favoritar"}
              </Button>
            </div>
          </div>

          {/* Compartilhamento */}
          <div className="mt-1 hidden flex-wrap items-center gap-3 text-xs text-[#B39463] sm:flex sm:text-sm">
            <span className="font-semibold text-white">
              Compartilhar este NFT:
            </span>

            <button
              type="button"
              aria-label="Compartilhar no LinkedIn"
              onClick={() => handleShare("linkedin")}
              className="transition hover:text-white"
            >
              in
            </button>

            <button
              type="button"
              aria-label="Compartilhar por e-mail"
              onClick={() => handleShare("email")}
              className="transition hover:text-white"
            >
              ✉
            </button>

            <button
              type="button"
              aria-label="Compartilhar no Twitter"
              onClick={() => handleShare("twitter")}
              className="transition hover:text-white"
            >
              𝕏
            </button>
          </div>
        </section>
      </div>

      {/* Detalhes e avaliações */}
      <section className="hidden w-full sm:mt-10 sm:block">
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
              {nft.name} faz parte da coleção {nft.collection}. As informações
              sobre edição, procedência, rede e metadados devem ser verificadas
              antes da compra. Este marketplace apresenta os dados disponíveis
              no catálogo local do projeto.
            </p>

            <div className="space-y-3">
              <div>
                <p className="font-bold text-[#F5F1EB]">Rede:</p>
                <p>
                  A rede blockchain e os dados de procedência não estão
                  configurados no catálogo demonstrativo atual.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#F5F1EB]">Contrato:</p>
                <p>
                  O endereço do contrato inteligente ainda não foi informado
                  nos dados deste NFT.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#F5F1EB]">
                  Direitos autorais:
                </p>
                <p>
                  As informações de direitos autorais dependem dos metadados
                  oficiais da coleção.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 text-sm text-[#B39463]">
            <p className="font-bold text-white">
              Avaliações de colecionadores
            </p>
            <p className="mt-2">
              As avaliações exibidas são ilustrativas. Ainda não há integração
              com um serviço de avaliações no catálogo local.
            </p>
            <div className="mt-3 text-[#D98845]" aria-label="Avaliação ilustrativa">
              ★★★★★ <span className="text-xs text-[#B39463]">4.8/5</span>
            </div>
          </div>
        )}
      </section>

      {/* NFTs relacionados */}
      <section className="hidden w-full sm:mt-10 sm:block">
        <div className="border-b border-[#CFB28C]/30">
          <h2 className="pb-2 text-xs font-bold text-[#D98845] sm:text-sm">
            Mais desta coleção
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {relatedNfts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigateToNft(item.id)}
              className="min-w-0 cursor-pointer text-left"
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
                <p className="mt-1 font-bold text-[#D98845]">
                  {item.price.toFixed(2)} ETH
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Rodapé */}
      <div className="hidden sm:block">
        <Footer />
      </div>

      {/* Modal de zoom */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${nft.name}`}
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            aria-label="Fechar imagem ampliada"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#352117] text-white hover:bg-[#4A2C1B]"
          >
            <X className="h-5 w-5" />
          </button>

          <img
            src={selectedImage.image}
            alt={selectedImage.alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </>
  );
}
