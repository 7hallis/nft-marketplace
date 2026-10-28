
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

import { LoginBtn } from "@/components/loginBtn";
import { Link } from "@tanstack/react-router";
import { type Dispatch, type SetStateAction } from "react";
import { useLocation } from "@tanstack/react-router";


interface HeaderProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}


export default function Header({ search, setSearch }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);


  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Por enquanto, apenas registra o termo pesquisado.
    // Depois vamos conectar isso aos NFTs da página.
    console.log("Pesquisar NFT:", search);
  }

  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path

  const navLinkClass = (path:string) => 
    `relative py-2 transition-colors ${
      isActive(path)
       ? "font-bold text-[#D98845] after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:bg-[#D98845]"
      : "text-[#E8D9CE] hover:text-[#D98845]"
    }`

  return (
    <header className="w-full border-b border-[#2a1a13] bg-[#110B08]">
      <div className="relative mx-auto flex h-16 max-w-210 items-center justify-between px-4">        
          <Link
            to="/"
            className="text-[10px] font-bold tracking-[0.2em] text-[#E8D9CE]"
          >
            KURIO
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 font-mono text-xs md:flex">
            <Link
              to="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={navLinkClass("/")}
            >
              Início
            </Link>

            <Link
              to="/mercado"
              aria-current={isActive("/mercado") ? "page" : undefined}
              className={navLinkClass("/mercado")}
            >
              Mercado
            </Link>

            <Link
              to="/"
              aria-current={isActive("/criadores") ? "page" : undefined}
              className={navLinkClass("/criadores")}
            >
              Criadores
            </Link>

            <Link
              to="/"
              aria-current={isActive("/aprenda") ? "page" : undefined}
              className={navLinkClass("/aprenda")}
            >
              Aprenda
            </Link>
          </nav>

        <div className="flex items-center gap-4 text-[#F4EEE8]">
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className="absolute left-4 right-4 top-18 z-20 flex items-center gap-2 rounded-lg border border-[#493024] bg-[#110B08] p-2 shadow-lg md:left-auto md:right-4 md:w-80"
            >
              <Search size={18} className="shrink-0 text-[#D98845]" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar NFTs..."
                aria-label="Pesquisar NFTs"
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-sm text-[#F4EEE8] outline-none placeholder:text-[#8D786B]"
              />

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearch("");
                }}
                aria-label="Fechar pesquisa"
                className="text-[#E8D9CE] hover:text-[#D98845]"
              >
                <X size={18} />
              </button>
            </form>
          )}

          <button
            type="button"
            aria-label={searchOpen ? "Fechar pesquisa" : "Abrir pesquisa"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="transition-colors hover:text-[#D98845]"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label="Carrinho, 6 itens"
            className="relative transition-colors hover:text-[#D98845]"
          >
            <ShoppingCart size={18} />
            <span className="absolute -right-2 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#D98845] text-[8px] font-bold text-[#110B08]">
              6
            </span>
          </button>

          <LoginBtn />

          <button
            type="button"
            aria-label="Abrir menu"
            className="md:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
