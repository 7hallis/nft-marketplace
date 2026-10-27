import Image from "@/components/ui/image";
import { useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import nft1 from "../assets/nft1.png";
import nft2 from "../assets/nft2.png";
import nft3 from "../assets/nft3.png";
import nft4 from "../assets/nft4.png";
import { Card } from "@/components/ui/card";
import PriceFilter from "@/components/price-filter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Footer } from "@/components/footer";
import Header from "@/components/header";

const nfts = [
  {
    name: "Chimp Ape",
    id: "#042",
    price: "1.69",
    image: nft1,
    tag: "POPULAR",
  },
  {
    name: "Sage Nomad",
    id: "#009",
    price: "1.69",
    image: nft2,
    tag: "NOVO",
  },
  {
    name: "Neon Vessel",
    id: "#552",
    price: "1.99",
    image: nft3,
    tag: "",
  },
  {
    name: "Forest Spirit",
    id: "#127",
    price: "2.29",
    image: nft4,
    tag: "",
  },
  {
    name: "Golden Hour",
    id: "#218",
    price: "0.89",
    image: nft1,
    tag: "",
  },
  {
    name: "Dream State",
    id: "#077",
    price: "3.10",
    image: nft2,
    tag: "",
  },
];

const stories = [
  {
    date: "12 de setembro",
    readingTime: "Leitura de 6 min",
    title: "Como funciona a propriedade de NFTs",
    description:
      "Aprenda a colecionar, negociar e verificar ativos digitais.",
    image: nft3,
  },
  {
    date: "13 de setembro",
    readingTime: "Leitura de 2 min",
    title: "10 artistas digitais para acompanhar",
    description:
      "Conheça criadores que moldam a cultura digital.",
    image: nft1,
  },
  {
    date: "15 de setembro",
    readingTime: "Leitura de 3 min",
    title: "Raridade, atributos e procedência",
    description:
      "Entenda raridade, procedência, critérios curatoriais e utilidade.",
    image: nft4,
  },
  {
    date: "15 de setembro",
    readingTime: "Leitura de 2 min",
    title: "Como proteger sua carteira",
    description:
      "Proteja sua carteira, seus ativos e sua identidade.",
    image: nft2,
  },
];


export default function Hero() {
  // busca
  const [search, setSearch] = useState("");

    // 1. Declare o estado do preço primeiro
    // preço  
  const [priceRange, setPriceRange] =
  useState<[number, number]>([0.02, 12.3]);
  
  const [activeTab, setActiveTab] = useState<
  "todos" | "novos" | "alta"
>("todos");
const filteredNfts = nfts.filter((nft) => {
  const term = search.trim().toLowerCase();
  const price = Number(nft.price);

  const matchesSearch =
    nft.name.toLowerCase().includes(term) ||
    nft.id.toLowerCase().includes(term);

  const matchesPrice =
    price >= priceRange[0] &&
    price <= priceRange[1];

  const matchesTab =
    activeTab === "todos" ||
    (activeTab === "novos" && nft.tag === "NOVO") ||
    (activeTab === "alta" && nft.tag === "POPULAR");

  return matchesSearch && matchesPrice && matchesTab;
});


  return (
    <main className="site-shell">
      <Header search={search} setSearch={setSearch}/>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Bem-vindo à Kurio</p>
          <h1>SEJA DONO DO FUTURO<br/>DA ARTE DIGITAL</h1>
          <p className="hero-description">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
          </p>
          <a className="primary-btn" href="#colecoes">EXPLORAR MERCADO <ArrowUpRight size={15}/></a>
          <div className="hero-dots"><span/><span/><span/></div>
        </div>
        <div className="hero-art">
         <Image
            src={nft1}
            alt="Retrato de um macaco, arte de colecionável digital"
            fill
            priority
            sizes="(max-width: 700px) 100vw, 42vw"
          />
          <div className="art-label"><Sparkles size={14}/> COLEÇÃO EM DESTAQUE</div>
        </div>
      </section>

      <section className="market" id="colecoes">
        <div className="flex min-w-0 flex-col gap-5">
          <aside className="sidebar w-full min-w-0">
            <PriceFilter  priceRange={priceRange}
            onApply={setPriceRange}/>
          </aside>
          <aside
            aria-labelledby="featured-nft-title"
            className="w-full min-w-0 overflow-hidden rounded-md border border-[#3c281b] bg-[#21150f] p-2"
          >
            <h2
              className="mb-1 mt-1 px-2 font-mono text-sm font-bold tracking-wide text-[#e99a4a]"
              id="featured-nft-title"
            >
              NFT EM DESTAQUE
            </h2>
            <p className="mb-2 mt-0 text-center font-mono text-xs font-bold tracking-wide text-[#f4eee8]">
              OFERTA LIMITADA
            </p>
            <a
              className="relative block aspect-[0.72/1] overflow-hidden rounded-md bg-[#2a1b13]"
              href="#nfts"
              aria-label="Ver NFT em destaque: Sage Nomad"
            >
              <Image
                src={nft4}
                alt="Sage Nomad, macaco com chapéu verde e moletom roxo"
                fill
                sizes="(max-width: 650px) 70vw, 220px"
                className="object-cover"
              />
            </a>
          </aside>
        </div>

        <div className="market-content">
          <div className="market-heading">
            {/* Tabs */}
            <div className="tabs flex items-center gap-7">
              <button
                type="button"
                onClick={() => setActiveTab("todos")}
                className={`border-b-2 pt-3 pb-6 text-sm transition-colors ${
                  activeTab === "todos"
                    ? "border-[#D98845] font-bold text-[#D98845]"
                    : "border-transparent text-[#E8D9CE] hover:text-[#D98845]"
                }`}
              >
                Todos os NFTs
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("novos")}
                className={`border-b-2 pt-3 pb-6 text-sm transition-colors ${
                  activeTab === "novos"
                    ? "border-[#D98845] font-bold text-[#D98845]"
                    : "border-transparent text-[#E8D9CE] hover:text-[#D98845]"
                }`}
              >
                Novos lançamentos
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("alta")}
                className={`border-b-2 pt-3 pb-6 text-sm transition-colors ${
                  activeTab === "alta"
                    ? "border-[#D98845] font-bold text-[#D98845]"
                    : "border-transparent text-[#E8D9CE] hover:text-[#D98845]"
                }`}
              >
                Em alta
              </button>
            </div>
            <button className="sort-btn"><SlidersHorizontal size={15}/> <span>Listados recentemente</span><ChevronDown size={15}/></button>
          </div>
          <div className="mobile-filter"><SlidersHorizontal size={16}/> Filtros</div>
          <div className="nft-grid" id="nfts">
            {filteredNfts.map((nft) => (
              <article className="nft-card" key={nft.id}>
                <a className="nft-image" href="#detalhes" aria-label={`Ver ${nft.name}`}>
                  <Image src={nft.image} alt={nft.name} fill sizes="(max-width: 700px) 45vw, (max-width: 1000px) 30vw, 22vw"/>
                  {nft.tag && <span className="nft-tag">{nft.tag}</span>}
                  <span className="quick-view"><ArrowUpRight size={17}/></span>
                </a>
                <div className="nft-info">
                  <div><h2>{nft.name}</h2><p>{nft.name} {nft.id}</p></div>
                  <div className="nft-price"><span>{nft.price} ETH</span><small>≈ ${(Number(nft.price) * 3200).toLocaleString("en-US", { maximumFractionDigits: 0 })}</small></div>
                </div>
              </article>
            ))}
          </div>
        <Pagination className="mx-0 mt-6 w-full justify-end">
          <PaginationContent className="gap-1.5">
            <PaginationItem>
              <PaginationLink
                href="#nfts"
                isActive
                aria-label="Página 1"
                className="h-6 w-6 rounded-sm border-[#d28a4c] bg-[#d28a4c] p-0 font-mono text-[10px] text-[#1a100a] hover:bg-[#e99a4a] hover:text-[#1a100a]"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#nfts"
                aria-label="Página 2"
                className="h-6 w-6 rounded-sm border border-[#3c281b] bg-transparent p-0 font-mono text-[10px] text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#f4eee8]"
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#nfts"
                aria-label="Página 3"
                className="h-6 w-6 rounded-sm border border-[#3c281b] bg-transparent p-0 font-mono text-[10px] text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#f4eee8]"
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#nfts"
                aria-label="Página 4"
                className="h-6 w-6 rounded-sm border border-[#3c281b] bg-transparent p-0 font-mono text-[10px] text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#f4eee8]"
              >
                4
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#nfts"
                aria-label="Próxima página"
                className="h-6 w-6 rounded-sm border border-[#3c281b] bg-transparent p-0 font-mono text-[10px] leading-none text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#f4eee8]"
              >
              <ChevronRight className="h-4 w-4" />  
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        </div>
      </section>
      <section
        aria-label="Destaques do marketplace"
        className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2"
      >
        <Card className="min-h-40 flex-row items-stretch gap-0 rounded-md border border-[#3c281b] bg-[#21150f] p-0 text-[#f4eee8] ring-0">
          <div className="relative min-h-40 w-[48%] shrink-0 overflow-hidden rounded-l-md">
            <Image
              src={nft1}
              alt="Colecionável digital de um macaco usando óculos"
              fill
              sizes="(max-width: 767px) 48vw, 23vw"
              className="object-left object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 px-3 py-4 text-center sm:px-4">
            <h2 className="m-0 font-mono text-[11px] font-bold leading-snug text-[#f4eee8] sm:text-xs">
              Lançamentos gênesis
              <br />
              de edição limitada
            </h2>
            <p className="m-0 max-w-52 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
              Colecione edições escassas diretamente dos criadores antes da revelação pública.
            </p>
            <a
              className="inline-flex items-center gap-1 rounded bg-[#d28a4c] px-3 py-1.5 font-mono text-[9px] text-[#1a100a] transition-colors hover:bg-[#e99a4a]"
              href="#nfts"
            >
              Explorar <ArrowRight size={12} />
            </a>
          </div>
        </Card>

        <Card className="min-h-40 flex-row items-stretch gap-0 rounded-md border border-[#3c281b] bg-[#21150f] p-0 text-[#f4eee8] ring-0">
          <div className="relative min-h-40 w-[48%] shrink-0 overflow-hidden rounded-l-md">
            <Image
              src={nft3}
              alt="Colecionável digital de um macaco com roupa escura"
              fill
              sizes="(max-width: 767px) 48vw, 23vw"
              className="object-left object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 px-3 py-4 text-center sm:px-4">
            <h2 className="m-0 font-mono text-[11px] font-bold leading-snug text-[#f4eee8] sm:text-xs">
              Arte digital selecionada
              <br />
              e muito mais
            </h2>
            <p className="m-0 max-w-52 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
              Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
            </p>
            <a
              className="inline-flex items-center gap-1 rounded bg-[#d28a4c] px-3 py-1.5 font-mono text-[9px] text-[#1a100a] transition-colors hover:bg-[#e99a4a]"
              href="#colecoes"
            >
              Explorar <ArrowRight size={12} />
            </a>
          </div>
        </Card>
      </section>
      <section
        id="criadores"
        className="mt-12 bg-[#130d0a] px-3 py-8 sm:mt-16 sm:px-6 sm:py-10"
      >
        <div className="mb-7 text-center sm:mb-8">
          <h2 className="m-0 font-mono text-lg font-bold tracking-tight text-[#f4eee8] sm:text-[22px]">
            Diário da Cunhagem
          </h2>
          <p className="mb-0 mt-2 font-mono text-[9px] leading-relaxed text-[#aa9787] sm:text-[10px]">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <article
              className="group flex h-full flex-col overflow-hidden rounded-md border border-[#2e1d15] bg-[#21150f] transition-colors hover:border-[#80532f]"
              key={story.title}
            >
              <a className="relative block aspect-[1.36/1] shrink-0 overflow-hidden" href="#aprenda" aria-label={`Ler: ${story.title}`}>
                <Image
                  src={story.image}
                  alt={`Ilustração para o artigo: ${story.title}`}
                  fill
                  sizes="(max-width: 700px) 45vw, (max-width: 1000px) 30vw, 22vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </a>
              <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                <p className="mb-2 flex flex-wrap gap-x-2 font-mono text-[8px] leading-relaxed text-[#c5ad96] sm:text-[9px]">
                  <span>{story.date}</span>
                  <span aria-hidden="true">|</span>
                  <span>{story.readingTime}</span>
                </p>
                <h3 className="mb-1.5 mt-0 font-mono text-[11px] font-bold leading-snug text-[#f4eee8] sm:text-xs">
                  {story.title}
                </h3>
                <p className="m-0 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
                  {story.description}
                </p>
                <a
                  className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] text-[#e99a4a] transition-colors hover:text-[#f4eee8]"
                  href="#aprenda"
                >
                  Ler mais <ArrowRight size={10} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </main>
  );
}