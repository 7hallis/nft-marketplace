import { useState } from "react";
import {
  // Alteração: importa apenas os ícones exibidos na navegação e nos controles de senha.
  CircleHelp,
  Download,
  Eye,
  EyeOff,
  Heart,
  LogOut,
  ShoppingCart,
  Tag,
  UserRound,
  Wallet,
} from "lucide-react";
import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";

const profileLinks = [
  { label: "Dados do perfil", icon: UserRound },
  { label: "Carteiras", icon: Wallet },
  { label: "Atividade", icon: ShoppingCart },
  { label: "Lista de interesse", icon: Heart },
  { label: "Ofertas", icon: Tag },
  { label: "Arquivos baixados", icon: Download },
  { label: "Suporte", icon: CircleHelp },
  { label: "Sair", icon: LogOut },
];

const profileFields = [
  { label: "Nome de exibição", id: "display-name", required: true },
  { label: "Nome de usuário", id: "username", required: true },
  { label: "E-mail", id: "email", required: true, type: "email" },
  { label: "Nome ENS", id: "ens-name", required: true, placeholder: ".eth" },
  { label: "Apelido da carteira", id: "wallet-name", required: true },
];

const passwordFields = [
  { label: "Senha atual", id: "current-password" },
  { label: "Nova senha", id: "new-password" },
  { label: "Confirmar nova senha", id: "confirm-password" },
];

export default function PerfilPage() {
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  return (
    // Alteração: aplica o fundo escuro e a tipografia monoespaçada da imagem ao conteúdo da página.
    <div className="min-h-screen bg-[#110B08] text-[#E8D9CE]">
      <Header />

      {/* Alteração: amplia a área de duas colunas para reproduzir o espaço entre menu e formulário da referência. */}
      <main className="mx-auto grid w-full max-w-5xl grid-cols-[216px_minmax(0,600px)] justify-center gap-6 px-6 py-6">
        {/* Alteração: define 216px para o menu, mantendo a largura visual da referência menor. */}
        <aside className="h-75 w-54 border border-[#D98845]/50 bg-[#241612] p-2">
          <h1 className="mb-1 px-1 py-1 text-xs font-bold text-[#F4EEE8]">
            Meu perfil
          </h1>
          <nav aria-label="Navegação do perfil" className="flex flex-col">
            {profileLinks.map(({ label, icon: Icon }, index) => (
              <Link
                key={label}
                to="/"
                aria-current={index === 0 ? "page" : undefined}
                className={`flex items-center gap-2 border-l-2 px-2 py-2 text-[10px] transition-colors hover:bg-[#55321F]/40 hover:text-[#F4EEE8] ${
                  index === 0
                    ? "border-[#D98845] text-[#D98845]"
                    : "border-transparent text-[#D98845]/80"
                }`}
              >
                <Icon aria-hidden="true" size={12} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Alteração: organiza os campos em duas colunas no desktop e uma coluna em telas pequenas. */}
        <section className="min-w-0">
          <h2 className="mb-5 text-xs font-semibold text-[#F4EEE8]">
            Perfil do colecionador
          </h2>

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:gap-x-6">
            {profileFields.map((field) => (
              <label
                key={field.id}
                htmlFor={field.id}
                className="flex min-w-0 flex-col gap-1.5 text-[10px] text-[#E8D9CE]"
              >
                <span>
                  {field.label}
                  {field.required && (
                    <span className="text-[#F0805F]"> *</span>
                  )}
                </span>
                <Input
                  id={field.id}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  className="h-8 rounded-sm border-[#D98845]/20 bg-[#160F0C] px-2 text-xs text-[#E8D9CE] placeholder:text-[#8D7667] focus-visible:border-[#D98845] focus-visible:ring-[#D98845]/30"
                />
              </label>
            ))}

            {/* Alteração: posiciona o avatar e as ações de imagem ao lado do campo ENS como na referência. */}
            <div className="flex min-h-16 items-center gap-3 sm:row-span-2 sm:col-start-2 sm:row-start-3 sm:pl-1">
              <div
                aria-label="Avatar do perfil"
                className="flex size-20 shrink-0 items-center justify-center rounded-full border border-[#D98845]/40 bg-[#2A211D] text-2xl font-semibold text-[#D98845] shadow-lg"
              >
                T
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-sm bg-[#D98845] px-3 py-2 text-[10px] font-semibold text-[#110B08] transition-colors hover:bg-[#E8A15F]">
                  Alterar
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-label="Alterar foto do perfil"
                  />
                </label>
                <button
                  type="button"
                  className="px-2 py-2 text-[10px] text-[#E8D9CE] transition-colors hover:text-[#D98845]"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>

          {/* Alteração: adiciona os três campos de senha e controles para mostrar ou ocultar cada valor. */}
          <fieldset className="mt-5 max-w-md">
            <legend className="mb-3 text-xs font-semibold text-[#F4EEE8]">
              Alterar senha
            </legend>
            <div className="flex flex-col gap-3">
              {passwordFields.map((field) => {
                const isVisible = visiblePasswords[field.id] ?? false;
                const ToggleIcon = isVisible ? EyeOff : Eye;

                return (
                  <label
                    key={field.id}
                    htmlFor={field.id}
                    className="flex flex-col gap-1.5 text-[10px] text-[#E8D9CE]"
                  >
                    <span>{field.label}</span>
                    <span className="relative">
                      <Input
                        id={field.id}
                        type={isVisible ? "text" : "password"}
                        className="h-8 rounded-sm border-[#D98845]/20 bg-[#160F0C] px-2 pr-9 text-xs text-[#E8D9CE] focus-visible:border-[#D98845] focus-visible:ring-[#D98845]/30"
                      />
                      <button
                        type="button"
                        aria-label={
                          isVisible ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() =>
                          setVisiblePasswords((current) => ({
                            ...current,
                            [field.id]: !isVisible,
                          }))
                        }
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-[#B39463] hover:text-[#D98845]"
                      >
                        <ToggleIcon aria-hidden="true" size={12} />
                      </button>
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Alteração: posiciona o botão Salvar sob os campos de senha e mantém o destaque da paleta. */}
            <button
              type="button"
              className="mt-4 rounded-sm bg-[#D98845] px-5 py-2 text-[10px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D98845]"
            >
              Salvar
            </button>
          </fieldset>
        </section>
      </main>
    </div>
  );
}
