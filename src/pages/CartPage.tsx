
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
import nft2 from "../assets/nft2.png";
import nft3 from "../assets/nft3.png";
import nft4 from "../assets/nft4.png";
import { Footer } from "@/components/footer";
import CarrinhoPage from "@/components/carrinho";
import { useState } from "react";

const recommendedNfts = [
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
];

export default function Carrinho() {
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#110B08] font-mono text-[#E8D9CE]">
      <div className="mx-auto w-full max-w-6xl px-0 py-0 sm:px-6 sm:py-6 lg:px-8">

        {/* Header: somente desktop */}
        <div className="hidden lg:block">
          <Header search={search} setSearch={setSearch} />
        </div>

        {/* Breadcrumb: somente desktop */}
        <div className="hidden lg:block">
          <Breadcrumb className="mb-6 text-sm text-[#B39463]">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<a href="/home" />}>
                  Início
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>/</BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbLink render={<a href="/mercado" />}>
                  Mercado
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>/</BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbPage>Carrinho</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Carrinho: visível no mobile e desktop */}
        <section className="min-w-0">
          <CarrinhoPage />
        </section>

        {/* Produtos recomendados: somente desktop */}
        <section className="mt-10 hidden w-full lg:block">
          <div className="border-b border-[#CFB28C]/30">
            <h2 className="pb-2 text-sm font-bold text-[#D98845]">
              Colecionadores também viram
            </h2>
          </div>

          <div className="grid grid-cols-5 gap-4 pt-4">
            {recommendedNfts.map((item) => (
              <article key={item.name} className="min-w-0">
                <div className="bg-[#241612] p-3">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    className="aspect-[4/5] w-full rounded-lg object-cover"
                  />
                </div>

                <div className="pt-2 text-xs leading-tight text-[#E8D9CE]">
                  <p className="truncate">{item.name}</p>
                  <p className="mt-1 font-bold text-[#D98845]">
                    {item.price}
                  </p>
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

        {/* Footer: somente desktop */}
        <div className="hidden lg:block">
          <Footer />
        </div>
      </div>
    </main>
  );
}
