
import { Home, Wallet, UserRound } from "lucide-react";
import { SidebarLink } from "./SidebarLink";

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-1">
      <SidebarLink to="/" icon={<Home size={12} aria-hidden="true" />}>
        Início
      </SidebarLink>

      <SidebarLink to="/carteira" icon={<Wallet size={12} aria-hidden="true" />}>
        Carteira
      </SidebarLink>

      <SidebarLink to="/perfil" icon={<UserRound size={12} aria-hidden="true" />}>
        Perfil
      </SidebarLink>
    </aside>
  );
}
