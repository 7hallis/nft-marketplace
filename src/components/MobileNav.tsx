import {
  Home,
  Heart,
  CirclePlus,
  Layers,
  UserRound,
} from "lucide-react";

const items = [
  { label: "Início", icon: Home, href: "#inicio" },
  { label: "Favoritos", icon: Heart, href: "#favoritos" },
  { label: "Criar NFT", icon: CirclePlus, href: "#criar" },
  { label: "Coleções", icon: Layers, href: "#colecoes" },
  { label: "Perfil", icon: UserRound, href: "#perfil" },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed inset-x-2 bottom-2 z-50 flex h-16 items-center justify-around rounded-[28px] border border-[#3c281b] bg-[#21150f]/95 px-2 shadow-xl backdrop-blur-md md:hidden"
    >
      {items.map(({ label, icon: Icon, href }, index) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            index === 2
              ? "-mt-8 h-14 w-14 border-4 border-[#21150f] bg-[#b77b45] text-white shadow-lg"
              : "text-[#d9b995] hover:bg-white/10 hover:text-[#e99a4a]"
          }`}
        >
          <Icon size={index === 2 ? 25 : 20} />
        </a>
      ))}
    </nav>
  );
}