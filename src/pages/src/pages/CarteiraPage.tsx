
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  LogOut,
  ShieldCheck,
  Wallet as WalletIcon,
  Zap,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import axios from "axios";

import Header from "@/components/header";
import { useAuth } from "@/contexts/AuthContext";
import {
  connectWallet,
  disconnectWallet,
  getWallet,
} from "@/api/wallet";

const walletQueryKey = ["wallet"] as const;

const walletOptions = [
  {
    name: "MetaMask",
    description: "Carteira Ethereum",
    icon: "M",
  },
  {
    name: "WalletConnect",
    description: "Conecte uma carteira compatível",
    icon: "W",
  },
];

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return (
      error.response?.data?.message ??
      "Não foi possível concluir a operação."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}

function formatAddress(address: string | null) {
  if (!address) return "—";
  if (address.length < 16) return address;

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function CarteiraPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("MetaMask");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const walletQuery = useQuery({
    queryKey: walletQueryKey,
    queryFn: getWallet,
    enabled: isAuthenticated && !isLoading,
    retry: false,
  });

  const connectMutation = useMutation({
    mutationFn: async (name: string) => {
      const wallet = await connectWallet(name);

      if (!wallet.connected || !wallet.address) {
        throw new Error(
          "A API não confirmou a conexão da carteira.",
        );
      }

      return wallet;
    },

    onSuccess: async (wallet) => {
      queryClient.setQueryData(walletQueryKey, wallet);

      setMessage("Carteira conectada com sucesso!");
      setErrorMessage("");

      await queryClient.invalidateQueries({
        queryKey: walletQueryKey,
      });
    },

    onError: (error) => {
      console.error("[Carteira] Erro ao conectar:", error);
      setErrorMessage(getErrorMessage(error));
      setMessage("");
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectWallet,

    onSuccess: async (wallet) => {
      queryClient.setQueryData(walletQueryKey, wallet);

      setMessage("Carteira desconectada.");
      setErrorMessage("");

      await queryClient.invalidateQueries({
        queryKey: walletQueryKey,
      });
    },

    onError: (error) => {
      console.error("[Carteira] Erro ao desconectar:", error);
      setErrorMessage(getErrorMessage(error));
      setMessage("");
    },
  });

  const wallet = walletQuery.data;
  const isConnected = wallet?.connected === true;
  const isBusy =
    connectMutation.isPending || disconnectMutation.isPending;

  async function copyAddress() {
    if (!wallet?.address) return;

    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setErrorMessage("Não foi possível copiar o endereço.");
    }
  }

  function handleConnect() {
    setMessage("");
    setErrorMessage("");
    connectMutation.mutate(selectedWallet);
  }

  function handleDisconnect() {
    setMessage("");
    setErrorMessage("");
    disconnectMutation.mutate();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#110B08] text-sm text-[#E8D9CE]">
        Carregando sessão...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#110B08] text-[#E8D9CE]">
        <Header search={search} setSearch={setSearch} />

        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <WalletIcon
            className="mx-auto mb-4 text-[#D98845]"
            size={32}
          />

          <h1 className="mb-3 text-xl font-semibold text-[#F4EEE8]">
            Entre na sua conta
          </h1>

          <p className="mb-6 text-sm text-[#B39463]">
            Faça login para gerenciar sua carteira no Kurio.
          </p>

          <Link
            to="/"
            className="inline-flex rounded-sm bg-[#D98845] px-5 py-3 text-xs font-bold text-[#110B08] hover:bg-[#E8A15F]"
          >
            Voltar ao início
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110B08] text-[#E8D9CE]">
      <Header search={search} setSearch={setSearch} />

      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-6">
        <div className="mb-7 flex items-center gap-2 text-[11px] text-[#B39463]">
          <Link to="/perfil" className="hover:text-[#E8D9CE]">
            Meu perfil
          </Link>
          <ChevronRight size={13} />
          <span className="text-[#D98845]">Carteiras</span>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#D98845]">
            Área do colecionador
          </p>

          <h1 className="text-2xl font-semibold text-[#F4EEE8] sm:text-3xl">
            Minhas carteiras
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-[#B39463]">
            Gerencie sua carteira para preparar sua experiência de
            compra e coleção de NFTs no Kurio.
          </p>
        </div>

        {message && (
          <p
            role="status"
            className="mb-5 border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400"
          >
            {message}
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mb-5 border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {walletQuery.isLoading ? (
          <div className="border border-[#D98845]/20 bg-[#1B100C] p-8 text-sm text-[#B39463]">
            Carregando carteira...
          </div>
        ) : walletQuery.isError ? (
          <div className="border border-red-500/20 bg-[#1B100C] p-6">
            <p className="mb-3 text-sm text-[#F4EEE8]">
              Não foi possível carregar sua carteira.
            </p>

            <button
              type="button"
              onClick={() => walletQuery.refetch()}
              className="text-xs font-semibold text-[#D98845] hover:text-[#E8A15F]"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <section className="overflow-hidden rounded-sm border border-[#D98845]/30 bg-[#1B100C]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D98845]/15 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-sm border border-[#D98845]/30 bg-[#D98845]/10">
                    <WalletIcon size={19} className="text-[#D98845]" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#F4EEE8]">
                      Carteira principal
                    </h2>
                    <p className="mt-1 text-[10px] text-[#B39463]">
                      Sua conexão com o marketplace
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[10px] ${
                    isConnected
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-[#D98845]/20 bg-[#110B08] text-[#B39463]"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      isConnected
                        ? "bg-emerald-400"
                        : "bg-[#8D7667]"
                    }`}
                  />
                  {isConnected ? "Conectada" : "Desconectada"}
                </span>
              </div>

              {isConnected && wallet ? (
                <div className="p-5 sm:p-7">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-sm bg-[#D98845] text-lg font-bold text-[#110B08]">
                      {(wallet.name ?? "M").charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#F4EEE8]">
                        {wallet.name}
                      </p>
                      <p className="mt-1 text-[10px] text-[#B39463]">
                        Rede Ethereum · modo de demonstração
                      </p>
                    </div>
                  </div>

                  <p className="mb-2 text-[10px] text-[#B39463]">
                    Endereço público
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 border border-[#D98845]/20 bg-[#110B08] px-3 py-3 sm:px-4">
                    <code className="break-all text-xs text-[#E8D9CE]">
                      {formatAddress(wallet.address)}
                    </code>

                    <button
                      type="button"
                      onClick={copyAddress}
                      className="inline-flex shrink-0 items-center gap-2 text-[10px] text-[#D98845] hover:text-[#E8A15F]"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copiado" : "Copiar"}
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#D98845]/15 pt-5">
                    <div className="flex items-center gap-2 text-[10px] text-[#B39463]">
                      <ShieldCheck
                        size={15}
                        className="text-[#D98845]"
                      />
                      Endereço de demonstração
                    </div>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={handleDisconnect}
                      className="inline-flex items-center gap-2 border border-[#D98845]/30 px-3 py-2 text-[10px] text-[#E8D9CE] transition-colors hover:border-[#D98845] hover:text-[#D98845] disabled:opacity-50"
                    >
                      <LogOut size={13} />
                      {disconnectMutation.isPending
                        ? "Desconectando..."
                        : "Desconectar"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-7">
                  <h3 className="mb-2 text-sm font-semibold text-[#F4EEE8]">
                    Conecte sua carteira
                  </h3>

                  <p className="mb-6 max-w-xl text-xs leading-6 text-[#B39463]">
                    Escolha uma opção para simular a conexão. Nenhuma
                    extensão ou transação real será solicitada nesta
                    versão.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {walletOptions.map((option) => {
                      const selected = selectedWallet === option.name;

                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setSelectedWallet(option.name)}
                          className={`flex items-center gap-3 border p-4 text-left transition-colors ${
                            selected
                              ? "border-[#D98845] bg-[#D98845]/10"
                              : "border-[#D98845]/20 bg-[#110B08] hover:border-[#D98845]/60"
                          }`}
                        >
                          <span className="flex size-10 items-center justify-center rounded-sm bg-[#D98845] text-lg font-bold text-[#110B08]">
                            {option.icon}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold text-[#F4EEE8]">
                              {option.name}
                            </span>
                            <span className="mt-1 block text-[10px] text-[#B39463]">
                              {option.description}
                            </span>
                          </span>

                          {selected && (
                            <Check
                              size={15}
                              className="text-[#D98845]"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleConnect}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-[#D98845] px-5 py-3 text-xs font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Zap size={15} />
                    {connectMutation.isPending
                      ? "Conectando..."
                      : "Conectar carteira"}
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              )}
            </section>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <article className="border border-[#D98845]/20 bg-[#1B100C] p-5">
                <ShieldCheck
                  size={19}
                  className="mb-3 text-[#D98845]"
                />
                <h3 className="mb-2 text-xs font-semibold text-[#F4EEE8]">
                  Segurança
                </h3>
                <p className="text-[10px] leading-5 text-[#B39463]">
                  Nunca informe sua senha ou frase-semente para conectar
                  uma carteira. Esta tela utiliza dados fictícios.
                </p>
              </article>

              <article className="border border-[#D98845]/20 bg-[#1B100C] p-5">
                <WalletIcon
                  size={19}
                  className="mb-3 text-[#D98845]"
                />
                <h3 className="mb-2 text-xs font-semibold text-[#F4EEE8]">
                  Próximas funcionalidades
                </h3>
                <p className="text-[10px] leading-5 text-[#B39463]">
                  A conexão poderá ser integrada futuramente a uma
                  carteira real e utilizada no fluxo de compra de NFTs.
                </p>
              </article>
            </div>
          </>
        )}

        <div className="mt-6">
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2 text-[11px] text-[#B39463] transition-colors hover:text-[#D98845]"
          >
            Voltar ao perfil
            <ChevronRight size={13} />
          </Link>
        </div>
      </main>
    </div>
  );
}
