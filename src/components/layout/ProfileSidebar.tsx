
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarLink } from "./SidebarLink";

export function ProfileSidebar() {
  // Os hooks precisam ficar dentro do componente.
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleLogout() {
    try {
      await logout();
      queryClient.clear();
      await navigate({ to: "/" });
    } catch (error) {
      console.error("Não foi possível encerrar a sessão:", error);
    }
  }

  return (
    <aside className="h-fit border border-[#D98845]/50 bg-[#241612] p-2">
      <h1 className="mb-1 px-1 py-1 text-xs font-bold text-[#F4EEE8]">
        Meu perfil
      </h1>

      <nav aria-label="Navegação do perfil" className="flex flex-col">
        <SidebarLink to="/perfil" icon={null}>
          Dados do perfil
        </SidebarLink>

        <SidebarLink to="/carteira" icon={null}>
          Carteiras
        </SidebarLink>

        <SidebarLink to="/atividade" icon={null}>
          Atividade
        </SidebarLink>

        <SidebarLink to="/interesses" icon={null}>
          Lista de interesse
        </SidebarLink>

        <SidebarLink to="/ofertas" icon={null}>
          Ofertas
        </SidebarLink>

        <SidebarLink to="/downloads" icon={null}>
          Arquivos baixados
        </SidebarLink>

        <SidebarLink to="/suporte" icon={null}>
          Suporte
        </SidebarLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 border-l-2 border-transparent px-2 py-2 text-left text-[10px] text-[#D98845]/80 transition-colors hover:bg-[#55321F]/40 hover:text-[#F4EEE8]"
        >
          <LogOut aria-hidden="true" size={12} />
          <span>Sair</span>
        </button>
      </nav>
    </aside>
  );
}
