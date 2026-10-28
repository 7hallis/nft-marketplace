
import {
  Home,
  Heart,
  CirclePlus,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

const items = [
  { label: "Início", icon: Home, to: "/" },
  { label: "Favoritos", icon: Heart, to: "/favoritos" },
  { label: "Criar NFT", icon: CirclePlus, to: "/criar" },
  { label: "Carrinho", icon: ShoppingCart, to: "/carrinho" },
  { label: "Perfil", icon: UserRound, to: "/perfil" },
];

export function MobileNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed inset-x-2 bottom-2 z-50 flex h-16 items-center justify-around rounded-[28px] border border-[#3c281b] bg-[#21150f]/95 px-2 shadow-xl backdrop-blur-md md:hidden"
    >
      {items.map(({ label, icon: Icon, to }, index) => {
        const active = pathname === to;

        return (
          <Link
            key={label}
            to={to}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            title={label}
            className={`flex shrink-0 items-center justify-center rounded-full transition-colors ${
              index === 2
                ? "-mt-8 h-14 w-14 border-4 border-[#21150f] bg-[#b77b45] text-white shadow-lg"
                : `h-11 w-11 ${
                    active
                      ? "bg-white/10 text-[#e99a4a]"
                      : "text-[#d9b995] hover:bg-white/10 hover:text-[#e99a4a]"
                  }`
            }`}
          >
            <Icon size={index === 2 ? 25 : 20} />
          </Link>
        );
      })}
    </nav>
  );
}
