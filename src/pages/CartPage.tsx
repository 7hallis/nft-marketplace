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
import nft2 from "../assets/nft2.png";
import nft3 from "../assets/nft3.png";
import nft4 from "../assets/nft4.png";


import { Footer } from "@/components/footer";
import CarrinhoPage from "@/components/carrinho";

export default function Carrinho() {
  return (
    <main className="min-h-screen bg-[#110B08] font-mono text-[#E8D9CE]">
      <div className="mx-auto max-w-6xl px-4 py-6">
      <Header />
        <Breadcrumb className="mb-3 text-sm text-[#B39463]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href="/home" />}>Início</BreadcrumbLink>
            </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href="/mercado" />}>Mercado</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Carrinho</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div >
       {/* Charrinho de compras */}
          <section >
            <CarrinhoPage/>
          </section>
        </div>
          <section className="mt-10 w-full">
            {/* Indica a aba ativa com destaque laranja e mantém a linha divisória da referência. */}
            <div className="flex w-full gap-6 border-b border-[#CFB28C]/30 text-xs sm:text-sm">
           
            </div>

          
          </section>
          {/* Troca classes inválidas por utilitários Tailwind e reproduz o título com divisor da imagem. */}
          <section className="mt-10 w-full">
            <div className="border-b border-[#CFB28C]/30">
              <h2 className="pb-1 text-xs font-bold text-[#D98845] sm:text-sm">
                Colecionadores também viram
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