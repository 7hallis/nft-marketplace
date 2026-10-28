
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type SidebarRoute =
  | "/"
  | "/perfil"
  | "/carteira"
  | "/atividade"
  | "/interesses"
  | "/ofertas"
  | "/downloads"
  | "/suporte";

interface SidebarLinkProps {
  to: SidebarRoute;
  children: ReactNode;
  icon: ReactNode;
}

export function SidebarLink({
  to,
  children,
  icon,
}: SidebarLinkProps) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      activeProps={{
        className: "border-[#D98845] text-[#D98845]",
        "aria-current": "page",
      }}
      inactiveProps={{
        className: "border-transparent text-[#D98845]/80",
      }}
      className="flex min-w-0 items-center gap-2 border-l-2 px-2 py-2 text-[10px] transition-colors hover:bg-[#55321F]/40 hover:text-[#F4EEE8]"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
