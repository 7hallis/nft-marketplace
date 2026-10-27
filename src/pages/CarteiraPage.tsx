import {
  // Alteração: importa apenas os ícones exibidos na navegação e nos controles de senha.
  CircleHelp,
  Download,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

// Alteração: define opções somente para os três campos que devem ser selects.
const networkOptions = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "solana", label: "Solana" },
  { value: "bnb-chain", label: "BNB Chain" },
  { value: "avalanche", label: "Avalanche" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
  { value: "base", label: "Base" },
];

const walletTypeOptions = [
  { value: "metamask", label: "MetaMask" },
  { value: "phantom", label: "Phantom" },
  { value: "trust-wallet", label: "Trust Wallet" },
  { value: "coinbase-wallet", label: "Coinbase Wallet" },
  { value: "walletconnect", label: "WalletConnect" },
  { value: "ledger", label: "Ledger (Hardware Wallet)" },
  { value: "other", label: "Outra carteira" },
];

const ensOptions = [{ value: "eth", label: ".eth" }];

type ProfileField = {
  label: string;
  id: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  options?: { value: string; label: string }[];
};

const profileFields: ProfileField[] = [
  { label: "Nome de exibição", id: "display-name", required: true },
  { label: "Apelido da carteira", id: "wallet-name", required: true },
  { label: "Rede", id: "username", required: true, placeholder: "Selecione uma rede", options: networkOptions },
  { label: "Nome perfil", id: "nome-perfil", required: true },
  { label: "Endereço Carteira", id: "endereco-carteira", required: true, },
  // Alteração: inclui o select de tipo de carteira sem substituir os demais campos existentes.
  { label: "Tipo de carteira", id: "wallet-type", required: true, placeholder: "Selecione uma carteira", options: walletTypeOptions },
  { label: "", id: "carteira-secundária", placeholder:"ENS ou carteira secundária (opcional)"},
  { label: "E-mail", id: "email", required: true, type: "email" },
  { label: "Nome ENS", id: "ens-name", required: true, placeholder: "Selecione uma extensão", options: ensOptions },
  { label: " ", id: "ens-input", },
];


export default function CarteiraPage() {
  return (
    // Alteração: aplica o fundo escuro e a tipografia monoespaçada da imagem ao conteúdo da página.
    <div className="min-h-screen bg-[#110B08] text-[#E8D9CE]">
      <Header />

      {/* Alteração mobile: empilha menu e formulário em telas pequenas e preserva as duas colunas no desktop. */}
      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-center gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[216px_minmax(0,600px)] lg:gap-6">
        {/* Alteração mobile: o menu ocupa a largura disponível e sua navegação rola horizontalmente em celulares. */}
        <aside className="h-auto w-full border border-[#D98845]/50 bg-[#241612] p-2 lg:h-75 lg:w-54">
          <h1 className="mb-1 px-1 py-1 text-xs font-bold text-[#F4EEE8]">
            Meu perfil
          </h1>
          <nav
            aria-label="Navegação do perfil"
            className="grid grid-cols-2 gap-1 lg:flex lg:flex-col lg:gap-0"
          >
            {profileLinks.map(({ label, icon: Icon }, index) => (
              <Link
                key={label}
                to="/"
                aria-current={index === 0 ? "page" : undefined}
                className={`flex min-w-0 items-center gap-2 border-l-2 px-2 py-2 text-[10px] transition-colors hover:bg-[#55321F]/40 hover:text-[#F4EEE8] ${
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

          {/* Alteração mobile: mantém os campos em uma coluna em celulares e usa duas em telas maiores. */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 lg:gap-x-6">
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
                {field.options ? (
                  // Alteração: Rede, Tipo de carteira e Nome ENS usam select; os outros campos permanecem inputs.
                  <Select items={field.options}>
                    <SelectTrigger
                      id={field.id}
                      className="h-8 rounded-sm border-[#D98845]/20 bg-[#160F0C] px-2 text-xs text-[#E8D9CE]"
                    >
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.id}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    className="h-8 rounded-sm border-[#D98845]/20 bg-[#160F0C] px-2 text-xs text-[#E8D9CE] placeholder:text-[#8D7667] focus-visible:border-[#D98845] focus-visible:ring-[#D98845]/30"
                  />
                )}
              </label>
            ))}
            

            {/* Alteração: posiciona o avatar e as ações de imagem ao lado do campo ENS como na referência. */}
            
          </div>

          {/* Alteração: adiciona os três campos de senha e controles para mostrar ou ocultar cada valor. */}
          <fieldset className="mt-5 max-w-md">
          
            

            {/* Alteração: posiciona o botão Salvar sob os campos de senha e mantém o destaque da paleta. */}
            <button
              type="button"
              className="mt-4 w-full rounded-sm bg-[#D98845] px-5 py-2 text-[10px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D98845] sm:w-auto"
            >
              Salvar Carteira
            </button>
          </fieldset>
            {/* Alteração mobile: empilha título e opções da carteira secundária para evitar aperto horizontal. */}
            <div className="m-3 flex flex-col items-start justify-between gap-3 text-sm font-roboto sm:flex-row sm:items-center">
            <p className="text-md font-roboto">Carteira secundária</p>
            <p className="flex items-center gap-2">
              <Checkbox className="border border-[#D98845] rounded-full font-roboto"/>
               Igual à carteira principal 
              <span className="text-[#D98845]">
                Adicionar
              </span>
            </p>
            </div>
            <p className="m-3 text-[#CFB28C] font-roboto">Você ainda não adicionou uma carteira secundária.</p>
        </section>
      </main>
    </div>
  );
}
