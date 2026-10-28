
import { useState, type FormEvent } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";

import { LoginBtn } from "@/components/loginBtn";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export default function Header({ search, setSearch }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Pesquisar NFT:", search);
  }

  async function handleLogout() {
    try {
      await logout();
      setUserMenuOpen(false);
      await navigate({ to: "/" });
    } catch (error) {
      console.error("Não foi possível encerrar a sessão:", error);
    }
  }

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) =>
    `relative py-2 transition-colors ${
      isActive(path)
        ? "font-bold text-[#D98845] after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:bg-[#D98845]"
        : "text-[#E8D9CE] hover:text-[#D98845]"
    }`;

  return (
    <header className="w-full border-b border-[#2a1a13] bg-[#110B08]">
      <div className="relative mx-auto flex h-16 max-w-[840px] items-center justify-between px-4">
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

        <div className="flex items-center gap-3 text-[#F4EEE8]">
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className="absolute left-4 right-4 top-[4.5rem] z-20 flex items-center gap-2 rounded-lg border border-[#493024] bg-[#110B08] p-2 shadow-lg md:left-auto md:right-4 md:w-80"
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
            onClick={() => navigate({ to: "/carrinho" })}
            aria-label={`Carrinho de compras, ${itemCount} itens`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#E8D9CE] transition hover:bg-[#D98845]/10 hover:text-[#D98845]"
          >
            <ShoppingCart className="h-5 w-5" />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D98845] px-1 text-[10px] font-bold leading-none text-black">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="flex max-w-36 items-center gap-2 rounded-md border border-[#493024] px-2 py-2 text-xs transition-colors hover:border-[#D98845] hover:text-[#D98845]"
              >
                <UserRound size={16} className="shrink-0" />
                <span className="truncate font-mono">
                  {user.displayName || user.username}
                </span>
                <ChevronDown size={14} className="shrink-0" />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-2 w-44 border border-[#493024] bg-[#21150f] p-1 shadow-xl"
                >
                  <Link
                    to="/perfil"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-xs hover:bg-[#D98845]/10 hover:text-[#D98845]"
                  >
                    <UserRound size={15} />
                    Meu perfil
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left font-mono text-xs text-[#E8D9CE] hover:bg-[#D98845]/10 hover:text-[#D98845]"
                  >
                    <LogOut size={15} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <LoginBtn />
          )}

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
