
import Image from "@/components/ui/image";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Search,
  X,
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
import { MobileNav } from "@/components/MobileNav";
import { useNavigate } from "@tanstack/react-router";

// Dados dos NFTs exibidos no marketplace.
const nfts = [
  { name: "Chimp Ape", id: "0042", price: "1.69", image: nft1, tag: "POPULAR" },
  { name: "Sage Nomad", id: "0009", price: "1.69", image: nft2, tag: "NOVO" },
  { name: "Neon Vessel", id: "0052", price: "1.99", image: nft3, tag: "" },
  { name: "Golden Beat #207", id: "0207", price: "2.29", image: nft4, tag: "" },
  { name: "Golden Hour", id: "0218", price: "0.89", image: nft1, tag: "" },
  { name: "Dream State", id: "0077", price: "3.10", image: nft2, tag: "" },
];

// Artigos exibidos na seção Diário da Cunhagem.
const stories = [
  {
    date: "12 de setembro",
    readingTime: "Leitura de 6 min",
    title: "Como funciona a propriedade de NFTs",
    description: "Aprenda a colecionar, negociar e verificar ativos digitais.",
    image: nft3,
  },
  {
    date: "13 de setembro",
    readingTime: "Leitura de 2 min",
    title: "10 artistas digitais para acompanhar",
    description: "Conheça criadores que moldam a cultura digital.",
    image: nft1,
  },
  {
    date: "15 de setembro",
    readingTime: "Leitura de 3 min",
    title: "Raridade, atributos e procedência",
    description: "Entenda raridade, procedência, critérios curatoriais e utilidade.",
    image: nft4,
  },
  {
    date: "15 de setembro",
    readingTime: "Leitura de 2 min",
    title: "Como proteger sua carteira",
    description: "Proteja sua carteira, seus ativos e sua identidade.",
    image: nft2,
  },
];

export default function Hero() {
  
const navigate = useNavigate();
  // Estados da busca, do preço, das abas e da paginação.
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0.02, 12.3]);
  const [activeTab, setActiveTab] = useState<"todos" | "novos" | "alta">("todos");
  const [currentPage, setCurrentPage] = useState(1);

  // Controla a abertura do filtro de preço no mobile.
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Controla a opção de ordenação apresentada ao usuário.
  const [sortBy, setSortBy] = useState<"recentes" | "preco-menor" | "preco-maior">("recentes");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const itemsPerPage = 4;

  // Volta à primeira página sempre que os filtros mudarem.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, priceRange, activeTab, sortBy]);

  // Filtra os NFTs por busca, preço e aba selecionada.
  const filteredNfts = nfts
    .filter((nft) => {
      const term = search.trim().toLowerCase();
      const price = Number(nft.price);

      const matchesSearch =
        nft.name.toLowerCase().includes(term) ||
        nft.id.toLowerCase().includes(term);

      const matchesPrice =
        price >= priceRange[0] && price <= priceRange[1];

      const matchesTab =
        activeTab === "todos" ||
        (activeTab === "novos" && nft.tag === "NOVO") ||
        (activeTab === "alta" && nft.tag === "POPULAR");

      return matchesSearch && matchesPrice && matchesTab;
    })
    // Aplica a ordenação selecionada.
    .sort((a, b) => {
      if (sortBy === "preco-menor") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "preco-maior") {
        return Number(b.price) - Number(a.price);
      }

      // Mantém a ordem original para a opção de recentes,
      // já que os dados atuais não possuem data de publicação.
      return nfts.indexOf(a) - nfts.indexOf(b);
    });

  // Calcula a quantidade de páginas e os NFTs da página atual.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNfts.length / itemsPerPage)
  );

  const paginatedNfts = filteredNfts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Classes compartilhadas pelas três abas.
  const tabClass = (tab: "todos" | "novos" | "alta") =>
    `shrink-0 border-b-2 px-0 pb-3 pt-3 font-mono text-[10px] transition-colors sm:text-sm ${
      activeTab === tab
        ? "border-[#D98845] font-bold text-[#D98845]"
        : "border-transparent text-[#E8D9CE] hover:text-[#D98845]"
    }`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1440px] overflow-x-clip bg-[#130d0a] px-3 pb-24 text-[#f4eee8] sm:px-6 md:pb-8 lg:px-10">

      {/* Cabeçalho completo exibido somente no desktop. */}
      <div className="hidden md:block">
        <Header search={search} setSearch={setSearch} />
      </div>

      {/* Barra fixa de pesquisa e filtro no mobile. */}
      <div className="sticky top-0 z-40 -mx-3 mb-4 flex items-center gap-2 border-b border-[#3c281b] bg-[#130d0a]/95 px-3 py-3 backdrop-blur-md md:hidden">
        <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#3c281b] bg-[#21150f] px-3">
          <Search size={17} className="shrink-0 text-[#c5ad96]" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar NFTs..."
            aria-label="Buscar NFTs"
            className="h-full min-w-0 flex-1 bg-transparent font-mono text-xs text-[#f4eee8] outline-none placeholder:text-[#8e7866]"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Limpar pesquisa"
              className="shrink-0 text-[#c5ad96] hover:text-[#e99a4a]"
            >
              <X size={15} />
            </button>
          )}
        </label>

        {/* O botão da barra superior abre o filtro de preço. */}
        <button
          type="button"
          aria-label="Abrir filtros"
          aria-expanded={mobileFiltersOpen}
          aria-controls="mobile-price-filter"
          onClick={() => setMobileFiltersOpen((open) => !open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#3c281b] bg-[#21150f] text-[#f4eee8] hover:border-[#d28a4c]"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Navegação inferior no mobile. */}
      <MobileNav />

      {/* Banner principal. */}
           {/* Banner principal: mantém o design original no desktop e adapta no mobile. */}
      <section
        id="inicio"
        className="relative mt-3 grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-center gap-3 bg-transparent sm:mt-5 sm:grid-cols-2 sm:gap-6 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_418px] lg:gap-10"
      >
        {/* Texto do banner */}
        <div className="relative z-10 flex min-w-0 flex-col items-start justify-center gap-2 py-3 sm:gap-3 lg:py-8">
          <p className="m-0 font-mono text-[8px] tracking-wide text-[#f4eee8] sm:text-xs">
            Bem-vindo à Kurio
          </p>

          <h1 className="m-0 max-w-full font-mono text-sm font-bold leading-tight tracking-tight text-[#f4eee8] sm:text-2xl lg:text-[40px] lg:leading-[1.6]">
            <span className="lg:whitespace-nowrap">SEJA DONO DO FUTURO</span>
            <br className="hidden lg:block" />
            <span className="lg:whitespace-nowrap">DA ARTE DIGITAL</span>
          </h1>

          <p className="m-0 max-w-xl font-mono text-[8px] leading-relaxed text-[#c5ad96] sm:text-xs lg:text-[13px] lg:leading-[1.75]">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </p>

          <a
            href="#colecoes"
            className="mt-1 inline-flex min-h-8 items-center justify-center gap-2 rounded-md bg-[#d98845] px-3 py-2 font-mono text-[9px] font-bold text-[#130d0a] transition-colors hover:bg-[#e99a4a] sm:px-5 sm:text-xs lg:mt-3 lg:min-h-[38px] lg:px-7"
          >
            EXPLORAR
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Imagem do banner */}
        <div className="relative aspect-square w-full min-w-0 overflow-hidden rounded-xl bg-[#d9d7b2] sm:rounded-2xl lg:ml-auto lg:max-w-[418px]">
          <Image
            src={nft1}
            alt="Retrato de um macaco usando óculos e jaqueta verde"
            fill
            priority
            sizes="(max-width: 639px) 42vw, (max-width: 1023px) 45vw, 418px"
            className="object-cover"
          />
        </div>

        {/* Indicadores do banner */}
        <div
          className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-2 lg:bottom-10"
          aria-label="Indicadores do banner"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#d98845]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#d98845]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#d98845]" />
        </div>
      </section>

      {/* Marketplace: barra lateral e conteúdo dos NFTs. */}
      <section
        id="colecoes"
        className="mt-5 grid min-w-0 grid-cols-1 gap-5 md:mt-8 md:grid-cols-[210px_minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-7"
      >
        {/* Barra lateral: filtro desktop e NFT em destaque. */}
        <div className="order-2 flex min-w-0 flex-col gap-5 md:order-1">
          <aside className="hidden min-w-0 md:block">
            <PriceFilter
              priceRange={priceRange}
              onApply={setPriceRange}
            />
          </aside>

          {/* Card em destaque. Não contém botão de filtro abaixo da imagem. */}
          <aside
            aria-labelledby="featured-nft-title"
            className="flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-[#3c281b] bg-[#21150f] p-3 md:block md:p-2"
          >
            <div className="min-w-0 flex-1 md:mb-2">
              <h2
                id="featured-nft-title"
                className="m-0 font-mono text-xs font-bold tracking-wide text-[#e99a4a] sm:text-sm"
              >
                NFT EM DESTAQUE
              </h2>

              <p className="mb-0 mt-2 font-mono text-[9px] font-bold tracking-wide text-[#f4eee8] sm:text-xs md:text-center">
                OFERTA LIMITADA
              </p>

              <p className="mb-0 mt-1 font-mono text-[9px] text-[#c5ad96] md:hidden">
                Conheça a arte em destaque.
              </p>
            </div>

            <a
              className="relative block aspect-[0.85/1] w-24 shrink-0 overflow-hidden rounded-lg bg-[#2a1b13] sm:w-28 md:mx-auto md:mt-2 md:aspect-[0.72/1] md:w-full"
              href="#nfts"
              aria-label="Ver NFT em destaque: Sage Nomad"
            >
              <Image
                src={nft4}
                alt="Sage Nomad, macaco com chapéu verde e moletom roxo"
                fill
                sizes="(max-width: 767px) 112px, 220px"
                className="object-cover"
              />
            </a>
          </aside>
        </div>

        {/* Conteúdo principal do marketplace. */}
        <div className="order-1 flex min-w-0 flex-col md:order-2">

          {/* Filtro de preço expansível no mobile, sem duplicar o botão. */}
          {mobileFiltersOpen && (
            <div
              id="mobile-price-filter"
              className="mb-4 rounded-xl border border-[#3c281b] bg-[#21150f] p-3 md:hidden"
            >
              <PriceFilter
                priceRange={priceRange}
                onApply={(range) => {
                  setPriceRange(range);
                  setMobileFiltersOpen(false);
                }}
              />
            </div>
          )}

          {/* Abas e ordenação permanecem na mesma linha em desktop e mobile. */}
          <div className="flex min-w-0 items-center justify-between gap-2 border-b border-[#3c281b]">

            {/* As abas podem rolar horizontalmente em telas estreitas. */}
            <div
              role="tablist"
              aria-label="Filtrar NFTs"
              className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto whitespace-nowrap sm:gap-7"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "todos"}
                onClick={() => setActiveTab("todos")}
                className={tabClass("todos")}
              >
                Todos os NFTs
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "novos"}
                onClick={() => setActiveTab("novos")}
                className={tabClass("novos")}
              >
                Novos lançamentos
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "alta"}
                onClick={() => setActiveTab("alta")}
                className={tabClass("alta")}
              >
                Em alta
              </button>
            </div>

            {/* Ordenação visível também no mobile. */}
            <div className="relative shrink-0">
              <button
                type="button"
                aria-expanded={sortMenuOpen}
                onClick={() => setSortMenuOpen((open) => !open)}
                className="flex items-center gap-1 py-3 font-mono text-[9px] text-[#c5ad96] transition-colors hover:text-[#e99a4a] sm:gap-2 sm:text-xs"
              >
                <span className="whitespace-nowrap">
                  {sortBy === "recentes"
                    ? "Listados recentemente"
                    : sortBy === "preco-menor"
                      ? "Menor preço"
                      : "Maior preço"}
                </span>
                <ChevronDown
                  size={13}
                  className={`shrink-0 transition-transform ${
                    sortMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Menu de ordenação feito com Tailwind. */}
              {sortMenuOpen && (
                <div className="absolute right-0 top-full z-30 mt-1 w-40 overflow-hidden rounded-lg border border-[#3c281b] bg-[#21150f] py-1 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("recentes");
                      setSortMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-left font-mono text-[10px] text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#e99a4a]"
                  >
                    Listados recentemente
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("preco-menor");
                      setSortMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-left font-mono text-[10px] text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#e99a4a]"
                  >
                    Menor preço
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("preco-maior");
                      setSortMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-left font-mono text-[10px] text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#e99a4a]"
                  >
                    Maior preço
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grade responsiva dos NFTs. */}
          <div
            id="nfts"
            className="grid min-h-[360px] min-w-0 grid-cols-2 content-start gap-x-3 gap-y-5 pt-4 sm:min-h-[400px] sm:gap-x-5 sm:gap-y-6 lg:grid-cols-3 xl:grid-cols-4"
          >
          
          {paginatedNfts.map((nft) => {
            const nftId = nft.id.replace("#", "");

            return (
              <article
                className="group min-w-0 overflow-hidden"
                key={nft.id}
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/nft/$nftId",
                      params: { nftId },
                    })
                  }
                  aria-label={`Ver detalhes de ${nft.name}`}
                  className="block w-full cursor-pointer text-left"
                >
                  <div className="relative block aspect-square overflow-hidden rounded-xl bg-[#21150f]">
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      fill
                      sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 22vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {nft.tag && (
                      <span
                        className={`absolute left-0 top-2 rounded-r px-2 py-1 font-mono text-[8px] font-bold sm:text-[9px] ${
                          nft.tag === "POPULAR"
                            ? "bg-[#d28a4c] text-[#1a100a]"
                            : "bg-[#e8d9ce] text-[#1a100a]"
                        }`}
                      >
                        {nft.tag}
                      </span>
                    )}

                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#21150f]/90 text-[#e99a4a]">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>

                  <div className="mt-2 flex min-w-0 flex-col gap-1 px-1">
                    <h2 className="m-0 truncate font-mono text-[10px] font-bold text-[#f4eee8] sm:text-sm">
                      {nft.name}
                    </h2>

                    <p className="mb-0 mt-0.5 font-mono text-[9px] text-[#aa9787] sm:text-xs">
                      {nft.name} {nft.id}
                    </p>

                    <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-1 gap-y-0.5">
                      <span className="font-mono text-[10px] font-bold text-[#e99a4a] sm:text-sm">
                        {nft.price} ETH
                      </span>

                      <small className="font-mono text-[8px] text-[#aa9787] sm:text-[10px]">
                        ≈ $
                        {(Number(nft.price) * 3200).toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </small>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}

            {/* Mensagem apresentada quando nenhum NFT corresponde aos filtros. */}
            {paginatedNfts.length === 0 && (
              <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center gap-2 text-center">
                <SlidersHorizontal size={24} className="text-[#80532f]" />

                <p className="m-0 font-mono text-sm text-[#f4eee8]">
                  Nenhum NFT encontrado
                </p>

                <p className="m-0 max-w-xs font-mono text-xs text-[#aa9787]">
                  Tente alterar a busca ou ajustar os filtros.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPriceRange([0.02, 12.3]);
                    setActiveTab("todos");
                    setSortBy("recentes");
                    setCurrentPage(1);
                  }}
                  className="mt-2 rounded-md bg-[#d28a4c] px-3 py-2 font-mono text-xs text-[#1a100a] hover:bg-[#e99a4a]"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          {/* Paginação dos resultados. */}
          <Pagination className="mx-0 mt-auto w-full justify-center pb-2 pt-5 sm:justify-end">
            <PaginationContent className="gap-1.5">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#nfts"
                      isActive={currentPage === page}
                      aria-label={`Página ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage(page);
                      }}
                      className={`h-7 w-7 rounded-md border p-0 font-mono text-[10px] ${
                        currentPage === page
                          ? "border-[#d28a4c] bg-[#d28a4c] text-[#1a100a] hover:bg-[#e99a4a] hover:text-[#1a100a]"
                          : "border-[#3c281b] bg-transparent text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#f4eee8]"
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationLink
                  href="#nfts"
                  aria-label="Próxima página"
                  aria-disabled={currentPage >= totalPages}
                  onClick={(event) => {
                    event.preventDefault();

                    if (currentPage < totalPages) {
                      setCurrentPage((page) => page + 1);
                    }
                  }}
                  className={`h-7 w-7 rounded-md border border-[#3c281b] bg-transparent p-0 font-mono text-[10px] text-[#f4eee8] hover:bg-[#2a1b13] hover:text-[#f4eee8] ${
                    currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* Cards de destaque. */}
      <section
        aria-label="Destaques do marketplace"
        className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-5 md:grid-cols-2"
      >
        <Card className="flex min-h-36 flex-row items-stretch gap-0 overflow-hidden rounded-xl border border-[#3c281b] bg-[#21150f] p-0 text-[#f4eee8] ring-0 sm:min-h-40">
          <div className="relative min-h-full w-[42%] shrink-0 overflow-hidden sm:w-[48%]">
            <Image
              src={nft1}
              alt="Colecionável digital de um macaco usando óculos"
              fill
              sizes="(max-width: 767px) 42vw, 23vw"
              className="object-contain object-center"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 px-3 py-4 sm:items-center sm:px-4 sm:text-center">
            <h2 className="m-0 font-mono text-[11px] font-bold leading-snug sm:text-xs">
              Lançamentos gênesis
              <br />
              de edição limitada
            </h2>

            <p className="m-0 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
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

        <Card className="flex min-h-36 flex-row items-stretch gap-0 overflow-hidden rounded-xl border border-[#3c281b] bg-[#21150f] p-0 text-[#f4eee8] ring-0 sm:min-h-40">
          <div className="relative min-h-full w-[42%] shrink-0 overflow-hidden sm:w-[48%]">
            <Image
              src={nft3}
              alt="Colecionável digital de um macaco com roupa escura"
              fill
              sizes="(max-width: 767px) 42vw, 23vw"
              className="object-contain object-center"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 px-3 py-4 sm:items-center sm:px-4 sm:text-center">
            <h2 className="m-0 font-mono text-[11px] font-bold leading-snug sm:text-xs">
              Arte digital selecionada
              <br />
              e muito mais
            </h2>

            <p className="m-0 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
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

      {/* Diário da Cunhagem: artigos responsivos. */}
      <section
        id="criadores"
        className="mt-10 bg-[#130d0a] py-8 sm:mt-16 sm:py-10"
      >
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="m-0 font-mono text-lg font-bold tracking-tight text-[#f4eee8] sm:text-[22px]">
            Diário da Cunhagem
          </h2>

          <p className="mx-auto mb-0 mt-2 max-w-xl font-mono text-[9px] leading-relaxed text-[#aa9787] sm:text-[10px]">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-4">
          {stories.map((story) => (
            <article
              className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#2e1d15] bg-[#21150f] transition-colors hover:border-[#80532f]"
              key={story.title}
            >
              <a
                className="relative block aspect-[1.1/1] shrink-0 overflow-hidden sm:aspect-[1.36/1]"
                href="#aprenda"
                aria-label={`Ler: ${story.title}`}
              >
                <Image
                  src={story.image}
                  alt={`Ilustração para o artigo: ${story.title}`}
                  fill
                  sizes="(max-width: 639px) 45vw, (max-width: 1023px) 45vw, 22vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </a>

              <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                <p className="mb-2 flex flex-wrap gap-x-1 font-mono text-[8px] leading-relaxed text-[#c5ad96] sm:gap-x-2 sm:text-[9px]">
                  <span>{story.date}</span>
                  <span aria-hidden="true">|</span>
                  <span>{story.readingTime}</span>
                </p>

                <h3 className="mb-1.5 mt-0 font-mono text-[10px] font-bold leading-snug text-[#f4eee8] sm:text-xs">
                  {story.title}
                </h3>

                <p className="m-0 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
                  {story.description}
                </p>

                <a
                  className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-[9px] text-[#e99a4a] transition-colors hover:text-[#f4eee8]"
                  href="#aprenda"
                >
                  Ler mais <ArrowRight size={10} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Rodapé. */}
      <Footer />
    </main>
  );
}
