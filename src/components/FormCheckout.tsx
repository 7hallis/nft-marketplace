
import Image from "./ui/image";
import nft1 from "../assets/nft1.png";
import nft2 from "../assets/nft2.png";
import nft3 from "../assets/nft3.png";


import { Checkbox } from "./ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

const walletTypes = [
  { value: "metamask", label: "MetaMask" },
  { value: "phantom", label: "Phantom" },
  { value: "trust-wallet", label: "Trust Wallet" },
  { value: "coinbase-wallet", label: "Coinbase Wallet" },
  { value: "walletconnect", label: "WalletConnect" },
  { value: "ledger", label: "Ledger (Hardware Wallet)" },
  { value: "other", label: "Outra carteira" },
];

const itemsRede = [
  { value: "eth", label: ".eth" },
];

const blockchainNetworks = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "solana", label: "Solana" },
  { value: "bnb-chain", label: "BNB Chain" },
  { value: "avalanche", label: "Avalanche" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
  { value: "base", label: "Base" },
  { value: "tezos", label: "Tezos" },
  { value: "bitcoin", label: "Bitcoin" },
  { value: "immutable", label: "Immutable" },
  { value: "flow", label: "Flow" },
  { value: "ronin", label: "Ronin" },
  { value: "cronos", label: "Cronos" },
  { value: "cardano", label: "Cardano" },
];

const nfts = [
  {
    idtoken: "ID do token: #0088",
    image: nft3,
    name: "Ivory Baron #088",
    price: "16.11 ETH",
    alt: "Macaco usando chapéu verde e moletom roxo",
    quanty: 9,
  },
  {
    idtoken: "ID do token: #0314",
    image: nft2,
    name: "Violet Nomad #314",
    price: "8.34 ETH",
    alt: "Macaco usando chapéu verde e moletom roxo",
    quanty: 6,
  },
  {
    idtoken: "ID do token: #0042",
    image: nft1,
    name: "Emerald Ape #042",
    price: "2.38 ETH",
    alt: "Macaco de pelo escuro usando roupa clara",
    quanty: 2,
  },
];
 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@base-ui/react";
// Ajuste: removidas importações não utilizadas que causavam erros de TypeScript neste componente.

export default function FormChekout() {


  const [useOtherWallet, setUseOtherWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");

 

  return (
    <main className="min-h-screen bg-[#110B08] px-4 py-4 font-mono text-[#E8D9CE] sm:px-6">
      <div className="w-full">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-8 lg:gap-12">
          <section aria-label="Perfil do colecionador" className="min-w-0">
            <h1 className="text-lg">Perfil do colecionador</h1>

            <FieldGroup className="mt-3 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="min-w-0">
                <FieldLabel>
                  Nome de exibição <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Input className="w-full border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]" />
              </Field>

              <Field className="min-w-0">
                <FieldLabel>
                  Nome de usuário <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Input className="w-full border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]" />
              </Field>

              <Field className="min-w-0">
                <FieldLabel>
                  Rede <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Select items={blockchainNetworks}>
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue placeholder="Selecione uma rede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Redes blockchain</SelectLabel>
                      {blockchainNetworks.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="min-w-0">
                <FieldLabel>
                  Nome do perfil <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Input className="w-full border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]" />
              </Field>

              <Field className="min-w-0">
                <FieldLabel>
                  Endereço da carteira <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Input className="w-full border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]" placeholder="0x..." />
              </Field>

              <Field className="min-w-0">
                <FieldLabel>ENS ou carteira secundária (opcional)</FieldLabel>
                <Input className="w-full border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]" placeholder="Nome ENS ou outro endereço" />
              </Field>

              <Field className="min-w-0">
                <FieldLabel>
                  Tipo de carteira <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Select items={walletTypes}>
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue placeholder="Selecione uma carteira" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Carteiras</SelectLabel>
                      {walletTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="min-w-0">
                <FieldLabel>
                  Código de indicação <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Input className="w-full border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]" />
              </Field>

              <Field className="min-w-0 ">
                <FieldLabel>
                  Email <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Input className="w-full border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]" type="email" />
              </Field>

              <Field className="min-w-0">
                <FieldLabel>
                  Nome ENS <span className="text-[#F0805F]">*</span>
                </FieldLabel>
                <Select items={itemsRede}>
                  <SelectTrigger className="w-full min-w-0 border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]">
                    <SelectValue placeholder="Selecione uma extensão" />
                  </SelectTrigger>
                  <SelectContent className="z-50 border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] shadow-xl">
                    <SelectGroup>
                      <SelectLabel>Extensões</SelectLabel>
                      {itemsRede.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="focus:!bg-[#3A251A] focus:!text-white"
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <div
              className={`mt-4 flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                useOtherWallet
                  ? "border-[#D98845] bg-[#D98845]/10"
                  : "border-[#D98845]/30 bg-transparent"
              }`}
            >
              <Checkbox
                id="use-other-wallet"
                checked={useOtherWallet}
                onCheckedChange={(checked) =>
                  setUseOtherWallet(checked === true)
                }
                className="rounded-full border-[#D98845] data-[state=checked]:border-[#D98845] data-[state=checked]:bg-[#D98845] data-[state=checked]:text-[#1C1410]"
              />
              <label
                htmlFor="use-other-wallet"
                className="cursor-pointer text-[#D98845]"
              >
                Usar outra carteira?
              </label>
            </div>

            {useOtherWallet && (
              <Field className="mt-3">
                <FieldLabel>Endereço da outra carteira</FieldLabel>
                <Input
                  className="w-full"
                  placeholder="Informe o endereço da carteira"
                />
              </Field>
            )}

            <Field className="mt-3">
              <FieldLabel>Observação do colecionador (opcional)</FieldLabel>
              {/* Ajuste: a área de observação agora se adapta à largura disponível sem ultrapassar o formulário. */}
              <Textarea className="min-h-44 w-full resize-y border border-[#D98845]/40 bg-[#1C1410] text-[#E8D9CE] focus:ring-[#D98845]" />
            </Field>
          </section>

          <aside className="w-full min-w-0 md:max-w-sm">
            <h2 className="pb-2 text-xs font-semibold text-[#E8D9CE]">
              Seus NFTs
            </h2>

            <div className="flex justify-between border-b border-[#CFB28C]/25 pb-2 text-xs">
              <p className="font-semibold">NFTs</p>
              <p>Subtotal</p>
            </div>

            <div className="flex flex-col gap-4 pt-5">
              {nfts.map((item) => (
                <article key={item.name} className="min-w-0">
                  <div className="flex min-w-0 gap-3 bg-[#241612] p-3 sm:gap-4">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      className="h-[70px] w-[70px] shrink-0 rounded-lg object-cover"
                    />

                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 text-[10px] leading-tight text-[#E8D9CE] sm:text-xs">
                      <p className="truncate">{item.name}</p>
                      <p>{item.idtoken}</p>
                      <p>Quantidade: {item.quanty}</p>
                      <p className="font-bold text-[#D98845]">{item.price}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="p-3">
              <h2 className="text-sm">
                Tem um código promocional? Aplique aqui
              </h2>

              <Input
                className="mt-3 w-full"
                placeholder="Código promocional"
              />

              <div className="mt-3 flex justify-between gap-2 text-sm">
                <p>Subtotal</p>
                <p>26.83 ETH</p>
              </div>

              <div className="mt-3 flex justify-between gap-2 text-sm">
                <p>Desconto do lançamento</p>
                <p>(-) 00.00 ETH</p>
              </div>

              <div className="mt-3 flex justify-between gap-2 text-sm">
                <p>Taxa de rede</p>
                <p>0.016 ETH</p>
              </div>

              <h2 className="mt-3 border-b border-b-[#D98845] text-center text-[#D98845]">
                Taxa estimada
              </h2>

              <div className="flex justify-between gap-2 p-6">
                <p className="text-[#F5F1EB]">Total</p>
                <p className="text-[#D98845]">26.846 ETH</p>
              </div>

              <h2 className="text-center text-[#F5F1EB]">
                Carteira e rede
              </h2>

              <div
                className={`mt-3 flex items-center gap-2 rounded-lg border p-4 text-sm transition-colors ${
                    selectedWallet === "all"
                    ? "border-[#D98845] bg-[#D98845]/10"
                    : "border-[#D98845]/30 bg-transparent"
                }`}
                >
            <Checkbox
                id="wallet-all"
                checked={selectedWallet === "all"}
                onCheckedChange={(checked) =>
                setSelectedWallet(checked === true ? "all" : "")
                }
                className="rounded-full border-[#D98845] data-[state=checked]:border-[#D98845] data-[state=checked]:bg-[#D98845] data-[state=checked]:text-[#1C1410]"
            />

            <label
                htmlFor="wallet-all"
                className="flex-1 cursor-pointer bg-[#55321F]/30 text-[9px] text-[#D98845]"
            >
                METAMASK • WALLETCONNECT • COINBASE
            </label>
            </div>

              <div className="mt-3 space-y-3">
                {[
                  { value: "metamask", label: "MetaMask" },
                  { value: "coinbase-wallet", label: "Coinbase Wallet" },
                ].map((wallet) => (
                  <div
                    key={wallet.value}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                      selectedWallet === wallet.value
                        ? "border-[#D98845] bg-[#D98845]/10"
                        : "border-[#D98845]/30 bg-transparent"
                    }`}
                  >
                    <Checkbox
                      id={`wallet-${wallet.value}`}
                      checked={selectedWallet === wallet.value}
                      onCheckedChange={(checked) =>
                        setSelectedWallet(
                          checked === true ? wallet.value : ""
                        )
                      }
                      className="rounded-full border-[#D98845] data-[state=checked]:border-[#D98845] data-[state=checked]:bg-[#D98845] data-[state=checked]:text-[#1C1410]"
                    />
                    <label
                      htmlFor={`wallet-${wallet.value}`}
                      className="flex-1 cursor-pointer text-[#D98845]"
                    >
                      {wallet.label}
                    </label>
                  </div>
                ))}
              </div>
            {/* Dialog */}

            <div className="w-full">

                <Dialog >
                    {/* Ajuste: reforça o estado de foco e a consistência visual do botão de confirmação. */}
                    <DialogTrigger className="mt-3 w-full rounded-sm bg-[#D98845] p-3 text-xs font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D98845]">Confirmar compra</DialogTrigger>
                    {/* Ajuste: limita a altura do diálogo e habilita rolagem vertical quando o conteúdo exceder a tela. */}
                    <DialogContent className="max-h-[85vh] overflow-y-auto border border-[#D98845]/50 bg-[#1C1410] p-6 text-[#E8D9CE] shadow-2xl sm:max-w-lg">
                        <DialogHeader>
                        {/* Ajuste: adiciona título acessível e visível para identificar a confirmação. */}
                        <DialogTitle className="text-center text-lg font-bold text-[#D98845]">Compra confirmada</DialogTitle>
                        {/* Ajuste: utiliza somente classes Tailwind padrão e melhora a hierarquia da mensagem. */}
                        <DialogDescription className="border-b border-[#D98845]/50 pb-4 text-center text-[#CFB28C]">
                           Seus NFTs agora estão na sua carteira
                        </DialogDescription>
                        {/* Ajuste: organiza os detalhes em uma grade responsiva para evitar que o conteúdo aperte em telas estreitas. */}
                        <div className="grid grid-cols-2 items-center gap-3 pt-2 sm:grid-cols-4">
                           <div className="min-w-0 border-r border-[#D28A4C]/50 px-2 text-center text-xs text-[#CFB28C]">
                                <p className="text-[10px] uppercase tracking-wide text-[#D98845]">ID da transação</p>
                                <p className="break-words font-medium">0xA91F…E82C</p>
                           </div>
                           
                           <div className="min-w-0 border-r border-[#D28A4C]/50 px-2 text-center text-xs text-[#CFB28C]">
                                <p className="text-[10px] uppercase tracking-wide text-[#D98845]">Data</p>
                                <p className="font-medium">29 Jul, 2026</p>
                           </div>
                           <div className="min-w-0 border-r border-[#D28A4C]/50 px-2 text-center text-xs text-[#CFB28C]">
                                <p className="text-[10px] uppercase tracking-wide text-[#D98845]">Total</p>
                                <p className="font-medium">26.846 ETH</p>
                           </div>
                           
                           {/* Ajuste: remove a borda terminal da grade e corrige o nome da carteira apresentado. */}
                           <div className="min-w-0 px-2 text-center text-xs text-[#CFB28C]">
                            <p className="text-[10px] uppercase tracking-wide text-[#D98845]">Carteira</p>
                            <p className="font-medium">MetaMask</p>
                           </div>
                        </div>
                        </DialogHeader>

                         <div className="flex flex-col gap-4 pt-5">
                            {nfts.map((item) => (
                                <article key={item.name} className="min-w-0">
                                <div className="flex min-w-0 gap-3 bg-[#241612] p-3 sm:gap-4">
                                    <Image
                                    src={item.image}
                                    alt={item.alt}
                                    className="h-[70px] w-[70px] shrink-0 rounded-lg object-cover"
                                    />

                                    {/* Ajuste de alinhamento: mantém os dados do NFT em uma linha e evita sobreposição em telas estreitas. */}
                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate">{item.name}</p>
                                    
                                    <p className="text-[#B39463]">{item.idtoken}</p>
                                    </div>
                                    <p className="shrink-0 text-[#CFB28C]">(X{item.quanty})</p>
                                    <div className="shrink-0 text-right">

                                    <p className="font-bold text-[#D98845]">{item.price}</p>
                                    </div>
                                    </div>
                                </div>
                                </article>
                            ))}
                                    <div className="m-3 p-2 border-b border-[#D28A4C]/50">
                                        {/* Ajuste de alinhamento: alinha rótulos e valores em colunas consistentes com o total. */}
                                        <div className="mx-auto flex w-full max-w-xs justify-between gap-4">
                                            <p>Taxa de rede</p>
                                            <p>0.016 ETH</p>
                                        </div>
                                        <div className="mx-auto flex w-full max-w-xs justify-between gap-4">
                                            <p className="text-md">Total</p>
                                            <p className="text-[#E89B55]">26.846 ETH</p>
                                        </div>
                                    </div>
                                        <p className="m-3 ">Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.</p>
                                        <Button className="p-3 bg-[#D98845] text-black text">Ver no Etherscan</Button>
                        </div>
                       
                    </DialogContent>
                    </Dialog>
            </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
