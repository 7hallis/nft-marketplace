
import { useEffect, useState } from "react";
import {
  Wallet,
  UserRound,
  ShoppingCart,
  Heart,
  Tag,
  Download,
  CircleHelp,
} from "lucide-react";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  emptyWalletProfile,
  getWalletProfile,
  saveWalletProfile,
  type WalletProfile,
} from "@/api/wallet";

import { SidebarLink } from "@/components/layout/SidebarLink";
import { ProfileSidebar } from "@/components/layout/ProfileSidebar";


type ProfileRoute =
  | "/perfil"
  | "/carteira"
  | "/atividade"
  | "/interesses"
  | "/ofertas"
  | "/downloads"
  | "/suporte";

type ProfileLinkItem = {
  label: string;
  icon: typeof UserRound;
  to: ProfileRoute;
};

const profileLinks = [
  { label: "Dados do perfil", icon: UserRound, to: "/perfil" },
  { label: "Carteiras", icon: Wallet, to: "/carteira" },
  { label: "Atividade", icon: ShoppingCart, to: "/atividade" },
  { label: "Lista de interesse", icon: Heart, to: "/interesses" },
  { label: "Ofertas", icon: Tag, to: "/ofertas" },
  { label: "Arquivos baixados", icon: Download, to: "/downloads" },
  { label: "Suporte", icon: CircleHelp, to: "/suporte" },
] satisfies ProfileLinkItem[];

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
  {
    label: "Rede",
    id: "username",
    required: true,
    placeholder: "Selecione uma rede",
    options: networkOptions,
  },
  { label: "Nome perfil", id: "nome-perfil", required: true },
  {
    label: "Endereço Carteira",
    id: "endereco-carteira",
    required: true,
  },
  {
    label: "Tipo de carteira",
    id: "wallet-type",
    required: true,
    placeholder: "Selecione uma carteira",
    options: walletTypeOptions,
  },
  {
    label: "",
    id: "carteira-secundária",
    placeholder: "ENS ou carteira secundária (opcional)",
  },
  { label: "E-mail", id: "email", required: true, type: "email" },
  {
    label: "Nome ENS",
    id: "ens-name",
    required: true,
    placeholder: "Selecione uma extensão",
    options: ensOptions,
  },
  { label: " ", id: "ens-input" },
];

const fieldMap: Record<string, keyof WalletProfile> = {
  "display-name": "displayName",
  "wallet-name": "walletName",
  username: "network",
  "nome-perfil": "profileName",
  "endereco-carteira": "address",
  "wallet-type": "walletType",
  "carteira-secundária": "secondaryWallet",
  email: "email",
  "ens-name": "ensExtension",
  "ens-input": "ensName",
};

export default function CarteiraPage() {
  const [profile, setProfile] = useState<WalletProfile>({
    ...emptyWalletProfile,
  });
   const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [secondaryAdded, setSecondaryAdded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await getWalletProfile();

        if (active) {
          setProfile({ ...emptyWalletProfile, ...data });
          setSecondaryAdded(Boolean(data.secondaryWallet));
        }
      } catch {
        if (active) {
          setMessage(
            "Não foi possível carregar os dados. Verifique se você está conectado.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    
    void loadProfile();
    
    return () => {
      active = false;
    };
  }, []);
  
  function updateField<K extends keyof WalletProfile>(
    field: K,
    value: WalletProfile[K],
  ) {
    setProfile((current) => ({ ...current, [field]: value }));
  }
  
  async function handleSave() {
    setMessage("");
    
    const requiredFields: (keyof WalletProfile)[] = [
      "displayName",
      "walletName",
      "network",
      "profileName",
      "address",
      "walletType",
      "email",
      "ensExtension",
    ];
    
    const missingField = requiredFields.some(
      (field) => !String(profile[field]).trim(),
    );
    
    if (missingField) {
      setMessage("Preencha todos os campos obrigatórios.");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setMessage("Informe um e-mail válido.");
      return;
    }
    
    setSaving(true);
    
    try {
      const saved = await saveWalletProfile(profile);
      
      setProfile({ ...emptyWalletProfile, ...saved });
      setSecondaryAdded(Boolean(saved.secondaryWallet));
      setMessage("Carteira salva com sucesso!");
    } catch (error) {
      const responseMessage = (
        error as {
          response?: { data?: { message?: string } };
        }
      ).response?.data?.message;
      
      setMessage(
        responseMessage ?? "Não foi possível salvar. Tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-[#110B08] text-[#E8D9CE]">
      <Header search={search} setSearch={setSearch} />

      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-center gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[216px_minmax(0,600px)] lg:gap-6">
       <ProfileSidebar />

        <section className="min-w-0">
          <h2 className="mb-5 text-xs font-semibold text-[#F4EEE8]">
            Perfil do colecionador
          </h2>

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 lg:gap-x-6">
            {profileFields.map((field) => {
              const key = fieldMap[field.id];

              return (
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
                    <Select
                      items={field.options}
                      value={String(profile[key] ?? "")}
                      onValueChange={(value) => {
                        if (value !== null) {
                          updateField(key, value as never);
                        }
                      }}
                    >
                      <SelectTrigger
                        id={field.id}
                        className="h-8 rounded-sm border-[#D98845]/20 bg-[#160F0C] px-2 text-xs text-[#E8D9CE]"
                      >
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>

                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
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
                      value={String(profile[key] ?? "")}
                      onChange={(event) =>
                        updateField(key, event.target.value as never)
                      }
                      required={field.required}
                      className="h-8 rounded-sm border-[#D98845]/20 bg-[#160F0C] px-2 text-xs text-[#E8D9CE] placeholder:text-[#8D7667] focus-visible:border-[#D98845] focus-visible:ring-[#D98845]/30"
                    />
                  )}
                </label>
              );
            })}
          </div>

          <fieldset className="mt-5 max-w-md">
            {message && (
              <p
                role="status"
                aria-live="polite"
                className="mt-3 text-xs text-[#E8D9CE]"
              >
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || loading}
              className="mt-4 w-full rounded-sm bg-[#D98845] px-5 py-2 text-[10px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading
                ? "Carregando..."
                : saving
                  ? "Salvando..."
                  : "Salvar Carteira"}
            </button>
          </fieldset>

          <div className="m-3 flex flex-col items-start justify-between gap-3 text-sm font-roboto sm:flex-row sm:items-center">
            <p className="text-md font-roboto">Carteira secundária</p>

            <div className="flex items-center gap-2">
              <Checkbox
                id="secondary-same"
                checked={profile.secondarySameAsPrimary}
                onCheckedChange={(checked) =>
                  updateField("secondarySameAsPrimary", checked === true)
                }
                className="rounded-full border border-[#D98845] font-roboto"
              />

              <label htmlFor="secondary-same">
                Igual à carteira principal
              </label>

              <button
                type="button"
                onClick={() => {
                  setSecondaryAdded(true);
                  setMessage(
                    "Preencha a carteira secundária no campo acima.",
                  );
                  document
                    .getElementById("carteira-secundária")
                    ?.focus();
                }}
                className="text-[#D98845] hover:text-[#E8A15F]"
              >
                Adicionar
              </button>
            </div>
          </div>

          {secondaryAdded && profile.secondaryWallet.trim() ? (
            <p className="m-3 break-all text-[#CFB28C]">
              Carteira secundária: {profile.secondaryWallet}
            </p>
          ) : (
            <p className="m-3 font-roboto text-[#CFB28C]">
              Você ainda não adicionou uma carteira secundária.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
