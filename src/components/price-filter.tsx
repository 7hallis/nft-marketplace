
import { useState } from "react";

import { Slider } from "@/components/ui/slider";

const maxPrice = 16.5;
const initialRange: [number, number] = [0.02, 12.3];

// interface
interface PriceFilterProps {
  priceRange: [number, number];
  onApply: (range: [number, number]) => void;
}


const networks = [
  { name: "Ethereum", count: 119 },
  { name: "Polygon", count: 78 },
  { name: "Solana", count: 86 },
];

const categories = [
  ["Arte digital", 33],
  ["Fotografia", 12],
  ["Música", 65],
  ["Arte 3D", 39],
  ["Colecionáveis", 23],
  ["Generativa", 17],
  ["Jogos", 19],
  ["Assinaturas", 13],
  ["Utilidade", 18],
] as const;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

export default function PriceFilter({
  priceRange,
  onApply,
}: PriceFilterProps) {
  
const [draftRange, setDraftRange] =
    useState<[number, number]>(priceRange);

  function handleApply() {
    onApply(draftRange);
  }

  return (
    <div className="space-y-7">
      <section aria-labelledby="collections-filter-title">
        <h3
          id="collections-filter-title"
          className="mb-3 mt-0 font-mono text-sm font-bold text-[#f4eee8]"
        >
          Coleções
        </h3>

        <ul className="m-0 grid list-none gap-2 p-0">
          {categories.map(([name, count]) => (
            <li key={name}>
              <a
                className="flex items-center justify-between px-2 font-mono text-[11px] text-[#c5ad96] transition-colors hover:text-[#e99a4a]"
                href="#nfts"
              >
                <span>{name}</span>
                <span>({count})</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="price-filter-title">
        <h3
          id="price-filter-title"
          className="mb-4 mt-0 font-mono text-sm font-bold text-[#f4eee8]"
        >
          Faixa de preço
        </h3>

        <Slider
          aria-label="Faixa de preço em ETH"
          className="w-full"
          min={0}
          max={maxPrice}
          step={0.01}
          value={draftRange}
          onValueChange={(value) => {
            if (Array.isArray(value) && value.length >= 2) {
              setDraftRange([value[0], value[1]]);
            }
          }}
        />

        <p
          aria-live="polite"
          className="mb-3 mt-3 font-mono text-[11px] text-[#e0d4c8]"
        >
          Preço: {formatPrice(draftRange[0])} -{" "}
          {formatPrice(draftRange[1])} ETH
        </p>

        <button
          className="rounded-sm bg-[#d28a4c] px-3 py-1.5 font-mono text-[11px] font-bold text-[#1a100a] transition-colors hover:bg-[#e99a4a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e99a4a]"
          onClick={handleApply}
          type="button"
        >
          Aplicar
        </button>

        <p className="sr-only" aria-live="polite">
          Filtro aplicado: {formatPrice(priceRange[0])} até{" "}
          {formatPrice(priceRange[1])} ETH.
        </p>
      </section>

      <section aria-labelledby="network-filter-title">
        <h3
          id="network-filter-title"
          className="mb-3 mt-0 font-mono text-sm font-bold text-[#f4eee8]"
        >
          Rede
        </h3>

        <ul className="m-0 grid list-none gap-3 p-0">
          {networks.map((network) => (
            <li key={network.name}>
              <a
                className="flex items-center justify-between px-2 font-mono text-xs text-[#c5ad96] transition-colors hover:text-[#f4eee8]"
                href="#nfts"
              >
                <span>{network.name}</span>
                <span>({network.count})</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
