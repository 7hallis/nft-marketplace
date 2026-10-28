import { useState, type FormEvent } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "@tanstack/react-router";

import { CheckCircle2, ShoppingBag } from "lucide-react";



import { createOrder, type Order } from "@/api/orders";

import { useAuth } from "@/contexts/AuthContext";

import { useCart } from "@/contexts/CartContext";

import Image from "./ui/image";

import { Checkbox } from "./ui/checkbox";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { Textarea } from "./ui/textarea";

import {

  Select,

  SelectContent,

  SelectGroup,

  SelectItem,

  SelectLabel,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select";

import {

  Dialog,

  DialogContent,

  DialogDescription,

  DialogHeader,

  DialogTitle,

} from "@/components/ui/dialog";



import { socket } from "@/lib/socket";



const NETWORK_FEE = 0.016;



const walletTypes = [

  { value: "metamask", label: "MetaMask" },

  { value: "phantom", label: "Phantom" },

  { value: "trust-wallet", label: "Trust Wallet" },

  { value: "coinbase-wallet", label: "Coinbase Wallet" },

  { value: "walletconnect", label: "WalletConnect" },

  { value: "ledger", label: "Ledger (Hardware Wallet)" },

  { value: "other", label: "Outra carteira" },

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



const walletOptions = [

  { value: "all", label: "Carteira compatível (selecionar depois)" },

  { value: "metamask", label: "MetaMask" },

  { value: "coinbase-wallet", label: "Coinbase Wallet" },

  { value: "walletconnect", label: "WalletConnect" },

];



type CheckoutForm = {

  displayName: string;

  username: string;

  network: string;

  profileName: string;

  walletAddress: string;

  secondaryWallet: string;

  walletType: string;

  referralCode: string;

  email: string;

  ensName: string;

  observation: string;

};



const initialForm: CheckoutForm = {

  displayName: "",

  username: "",

  network: "",

  profileName: "",

  walletAddress: "",

  secondaryWallet: "",

  walletType: "",

  referralCode: "",

  email: "",

  ensName: "",

  observation: "",

};



function formatEth(value: number) {

  return `${value.toFixed(3)} ETH`;

}



function getApiErrorMessage(error: unknown): string | null {

  if (typeof error !== "object" || error === null || !("response" in error)) {

    return null;

  }



  const response = error.response;



  if (

    typeof response !== "object" ||

    response === null ||

    !("data" in response)

  ) {

    return null;

  }



  const data = response.data;



  if (

    typeof data === "object" &&

    data !== null &&

    "message" in data &&

    typeof data.message === "string"

  ) {

    return data.message;

  }



  return null;

}



export default function FormCheckout() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { user, isAuthenticated } = useAuth();

  const { items, itemCount, clearCart } = useCart();



  const [form, setForm] = useState<CheckoutForm>(initialForm);

  const [selectedWallet, setSelectedWallet] = useState("");

  const [useOtherWallet, setUseOtherWallet] = useState(false);

  const [promoCode, setPromoCode] = useState("");

  const [discount, setDiscount] = useState(0);

  const [promoMessage, setPromoMessage] = useState("");

  const [error, setError] = useState("");

  const [order, setOrder] = useState<Order | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);



  const orderMutation = useMutation({

    mutationFn: createOrder,



    onSuccess: async (createdOrder) => {

      await queryClient.invalidateQueries({

        queryKey: ["orders"],

      });



      if (socket.connected) {

        socket.emit("order:created", createdOrder);

      }

    },

  });



  const subtotal = items.reduce(

    (sum, item) => sum + item.price * item.quantity,

    0,

  );



  const validDiscount =

    items.length > 0 ? Math.min(discount, subtotal) : 0;



  const networkFee = items.length > 0 ? NETWORK_FEE : 0;

  const total = Math.max(0, subtotal - validDiscount) + networkFee;



  function updateField<K extends keyof CheckoutForm>(

    key: K,

    value: CheckoutForm[K],

  ) {

    setForm((current) => ({ ...current, [key]: value }));

  }



  function applyPromo() {

    if (items.length === 0) {

      setDiscount(0);

      setPromoMessage("Seu carrinho está vazio.");

      return;

    }



    if (promoCode.trim().toUpperCase() === "KURIO10") {

      setDiscount(subtotal * 0.1);

      setPromoMessage("Cupom KURIO10 aplicado: 10% de desconto.");

    } else {

      setDiscount(0);

      setPromoMessage("Código inválido. Tente KURIO10.");

    }

  }



  async function handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    setError("");



    if (orderMutation.isPending) return;



    if (!isAuthenticated || !user) {

      setError("Faça login para finalizar sua compra.");

      return;

    }



    if (items.length === 0) {

      setError("Seu carrinho está vazio. Adicione um NFT antes de continuar.");

      return;

    }



    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (
      !selectedWallet ||
      (!isMobile && (
        !form.displayName.trim() ||
        !form.username.trim() ||
        !form.network ||
        !form.profileName.trim() ||
        !form.walletAddress.trim() ||
        !form.walletType ||
        !form.email.trim()
      ))
    ) {

      setError(

        "Preencha todos os campos obrigatórios e selecione uma carteira.",

      );

      return;

    }



    if (!isMobile && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {

      setError("Informe um endereço de e-mail válido.");

      return;

    }



    if (!isMobile && useOtherWallet && !form.secondaryWallet.trim()) {

      setError("Informe o endereço da carteira secundária.");

      return;

    }



    // Valida os dados dos NFTs antes de enviar o pedido.

    const invalidCartItem = items.some(

      (item) =>

        !item.id ||

        typeof item.name !== "string" ||

        !item.name.trim() ||

        !Number.isInteger(item.quantity) ||

        item.quantity < 1 ||

        item.quantity > 50 ||

        typeof item.price !== "number" ||

        !Number.isFinite(item.price) ||

        item.price < 0 ||

        typeof item.image !== "string",

    );



    if (invalidCartItem) {

      setError(

        "Um ou mais NFTs do carrinho possuem dados inválidos. Remova o item e adicione-o novamente.",

      );

      return;

    }



    try {

      const createdOrder = await orderMutation.mutateAsync({

        // IMPORTANTE: a API precisa receber todos os campos do item.

        items: items.map((item) => ({

          id: item.id,

          name: item.name,

          quantity: item.quantity,

          price: item.price,

          image: item.image,

        })),



        wallet: selectedWallet,

        network: form.network,

        walletAddress: form.walletAddress.trim(),

        walletType: form.walletType,

        displayName: form.displayName.trim(),

        username: form.username.trim(),

        profileName: form.profileName.trim(),

        email: form.email.trim(),

        secondaryWallet: form.secondaryWallet.trim(),

        referralCode: form.referralCode.trim(),

        ensName: form.ensName.trim(),

        observation: form.observation.trim(),

        promoCode:

          validDiscount > 0 ? promoCode.trim().toUpperCase() : "",

      });



      setOrder(createdOrder);

      setDialogOpen(true);

    } catch (requestError: unknown) {

      setError(

        getApiErrorMessage(requestError) ??

          "Não foi possível registrar o pedido. Tente novamente.",

      );

    }

  }



  function finishOrder() {

    clearCart();

    setDialogOpen(false);

    setOrder(null);

    void navigate({ to: "/mercado" });

  }



  if (items.length === 0 && !order) {

    return (

      <section className="rounded-md border border-[#CFB28C]/20 bg-[#21150F] p-8 text-center">

        <ShoppingBag className="mx-auto h-8 w-8 text-[#D98845]" />



        <h2 className="mt-3 text-lg font-bold text-white">

          Seu carrinho está vazio

        </h2>



        <p className="mt-2 text-sm text-[#B39463]">

          Adicione NFTs ao carrinho antes de finalizar a compra.

        </p>



        <button

          type="button"

          onClick={() => void navigate({ to: "/mercado" })}

          className="mt-5 rounded-sm bg-[#D98845] px-5 py-3 text-xs font-bold text-[#110B08] hover:bg-[#E8A15F]"

        >

          Explorar mercado

        </button>

      </section>

    );

  }



  return (

    <section className="min-w-0 bg-[#110B08] py-4 font-mono text-[#E8D9CE] sm:py-6">

      <form

        noValidate

        onSubmit={handleSubmit}

        className="flex min-w-0 flex-col gap-4 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-start lg:gap-12"

      >

        <section aria-label="Dados do colecionador" className="order-2 block min-w-0 rounded-2xl border border-[#D98845]/20 bg-[#1A100C] p-3 md:order-1 md:rounded-none md:border-0 md:bg-transparent md:p-0">

          <h1 className="text-base font-bold text-white md:text-lg">

            Perfil do colecionador

          </h1>



          <p className="mt-1 text-[10px] leading-relaxed text-[#B39463] md:text-xs">

            Campos marcados com * são obrigatórios.

          </p>



          <FieldGroup className="mt-3 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:mt-4 md:gap-4">

            <Field>

              <FieldLabel>Nome de exibição *</FieldLabel>

              <Input


                value={form.displayName}

                onChange={(event) =>

                  updateField("displayName", event.target.value)

                }

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>



            <Field>

              <FieldLabel>Nome de usuário *</FieldLabel>

              <Input


                value={form.username}

                onChange={(event) =>

                  updateField("username", event.target.value)

                }

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>



            <Field>

              <FieldLabel>Rede blockchain *</FieldLabel>

              <Select

                value={form.network}

                onValueChange={(value) =>

                  updateField(

                    "network",

                    typeof value === "string" ? value : "",

                  )

                }

                items={blockchainNetworks}

              >

                <SelectTrigger className="h-10 w-full border-[#D98845]/30 bg-[#110B08] text-xs md:bg-[#1C1410] md:text-sm">

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



            <Field>

              <FieldLabel>Nome do perfil *</FieldLabel>

              <Input


                value={form.profileName}

                onChange={(event) =>

                  updateField("profileName", event.target.value)

                }

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>



            <Field>

              <FieldLabel>Endereço da carteira *</FieldLabel>

              <Input


                value={form.walletAddress}

                onChange={(event) =>

                  updateField("walletAddress", event.target.value)

                }

                placeholder="Endereço público da carteira"

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>



            <Field>

              <FieldLabel>ENS ou carteira secundária</FieldLabel>

              <Input

                value={form.secondaryWallet}

                onChange={(event) =>

                  updateField("secondaryWallet", event.target.value)

                }

                placeholder="Opcional"

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>



            <Field>

              <FieldLabel>Tipo de carteira *</FieldLabel>

              <Select

                value={form.walletType}

                onValueChange={(value) =>

                  updateField(

                    "walletType",

                    typeof value === "string" ? value : "",

                  )

                }

                items={walletTypes}

              >

                <SelectTrigger className="h-10 w-full border-[#D98845]/30 bg-[#110B08] text-xs md:bg-[#1C1410] md:text-sm">

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



            <Field>

              <FieldLabel>Código de indicação</FieldLabel>

              <Input

                value={form.referralCode}

                onChange={(event) =>

                  updateField("referralCode", event.target.value)

                }

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>



            <Field>

              <FieldLabel>E-mail *</FieldLabel>

              <Input


                type="email"

                value={form.email}

                onChange={(event) =>

                  updateField("email", event.target.value)

                }

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>



            <Field>

              <FieldLabel>Nome ENS</FieldLabel>

              <Input

                value={form.ensName}

                onChange={(event) =>

                  updateField("ensName", event.target.value)

                }

                placeholder="Opcional"

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>

          </FieldGroup>



          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#D98845]/20 bg-[#110B08] p-3 md:mt-5 md:rounded-lg">

            <Checkbox

              id="use-other-wallet"

              checked={useOtherWallet}

              onCheckedChange={(checked) =>

                setUseOtherWallet(checked === true)

              }

            />

            <label

              htmlFor="use-other-wallet"

              className="cursor-pointer text-xs text-[#D98845]"

            >

              Informar uma carteira secundária diferente

            </label>

          </div>



          {useOtherWallet && (

            <Field className="mt-3">

              <FieldLabel>Endereço da carteira secundária *</FieldLabel>

              <Input


                value={form.secondaryWallet}

                onChange={(event) =>

                  updateField("secondaryWallet", event.target.value)

                }

                placeholder="Endereço público"

                className="h-10 min-w-0 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] placeholder:text-[#8D725E] focus-visible:ring-[#D98845] md:bg-[#1C1410] md:text-sm"

              />

            </Field>

          )}



          <Field className="mt-4">

            <FieldLabel>Observações (opcional)</FieldLabel>

            <Textarea

              value={form.observation}

              onChange={(event) =>

                updateField("observation", event.target.value)

              }

              className="min-h-24 border-[#D98845]/30 bg-[#110B08] text-xs text-[#E8D9CE] md:min-h-32 md:bg-[#1C1410] md:text-sm"

            />

          </Field>

        </section>



        <aside className="order-1 w-full min-w-0 rounded-[22px] border border-[#CFB28C]/15 bg-[#1A100C] p-3 md:order-2 md:rounded-md md:p-4 lg:p-5">

          <h2 className="border-b border-[#CFB28C]/25 pb-3 text-sm font-semibold text-white">

            Resumo da compra ({itemCount} itens)

          </h2>



          <div className="space-y-2 pt-3 sm:space-y-3 sm:pt-4">

            {items.map((item) => (

              <article key={item.id} className="flex min-w-0 gap-3">

                <Image

                  src={item.image}

                  alt={item.alt}

                  className="h-16 w-16 shrink-0 rounded-md object-cover"

                />



                <div className="min-w-0 flex-1">

                  <p className="break-words text-xs">{item.name}</p>

                  <p className="mt-1 text-[10px] text-[#B39463]">

                    {item.quantity} × {formatEth(item.price)}

                  </p>

                  <p className="mt-1 text-xs font-bold text-[#D98845]">

                    {formatEth(item.price * item.quantity)}

                  </p>

                </div>

              </article>

            ))}

          </div>



          <div className="mt-3 border-t border-[#CFB28C]/25 pt-3 sm:mt-5 sm:pt-4">

            <label

              className="text-xs text-[#B39463]"

              htmlFor="checkout-promo"

            >

              Código promocional

            </label>



            <div className="mt-2 flex">

              <Input

                id="checkout-promo"

                value={promoCode}

                onChange={(event) => setPromoCode(event.target.value)}

                placeholder="KURIO10"

                className="min-w-0 border-[#D98845]/40 bg-[#110B08] text-xs"

              />



              <button

                type="button"

                onClick={applyPromo}

                className="shrink-0 ml-2 bg-[#D98845] px-3 text-xs font-bold text-[#110B08] hover:bg-[#E8A15F]"

              >

                Aplicar

              </button>

            </div>



            {promoMessage && (

              <p

                aria-live="polite"

                className="mt-2 text-[10px] text-[#D98845]"

              >

                {promoMessage}

              </p>

            )}

          </div>



          <dl className="mt-3 space-y-2 text-[11px] sm:mt-5 sm:space-y-3 sm:text-xs">

            <div className="flex justify-between gap-3">

              <dt className="text-[#B39463]">Subtotal</dt>

              <dd>{formatEth(subtotal)}</dd>

            </div>



            <div className="flex justify-between gap-3">

              <dt className="text-[#B39463]">Desconto</dt>

              <dd className="text-[#D98845]">

                − {formatEth(validDiscount)}

              </dd>

            </div>



            <div className="flex justify-between gap-3">

              <dt className="text-[#B39463]">Taxa de rede estimada</dt>

              <dd>{formatEth(networkFee)}</dd>

            </div>

          </dl>



          <div className="mt-3 flex justify-between gap-3 border-t border-[#CFB28C]/25 pt-3 text-xs font-bold sm:mt-5 sm:pt-4 sm:text-sm">

            <span>Total</span>

            <span className="text-[#D98845]">{formatEth(total)}</span>

          </div>



          <h3 className="mt-6 text-sm font-semibold">

            Carteira para a simulação

          </h3>



          <p className="mt-1 text-[10px] text-[#B39463]">

            A seleção não conecta uma carteira real.

          </p>



          <div className="mt-3 space-y-2">

            {walletOptions.map((wallet) => (

              <label

                key={wallet.value}

                className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-[11px] sm:p-3 sm:text-xs ${

                  selectedWallet === wallet.value

                    ? "border-[#D98845] bg-[#D98845]/10"

                    : "border-[#D98845]/25 bg-[#21150F]"

                }`}

              >

                <input

                  type="radio"

                  name="checkout-wallet"

                  value={wallet.value}

                  checked={selectedWallet === wallet.value}

                  onChange={() => setSelectedWallet(wallet.value)}

                  className="accent-[#D98845]"

                />

                <span className="text-[#E8D9CE]">{wallet.label}</span>

              </label>

            ))}

          </div>



          {error && (

            <p

              role="alert"

              className="mt-4 rounded-md border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300"

            >

              {error}

            </p>

          )}



          <button

            type="submit"

            disabled={orderMutation.isPending}

            className="mt-4 w-full rounded-full bg-[#C17C42] px-3 py-3 text-[11px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-sm sm:text-xs"

          >

            {orderMutation.isPending

              ? "Registrando pedido..."

              : "Confirmar compra simulada"}

          </button>



          <p className="mt-3 text-center text-[10px] text-[#B39463]">

            Nenhum pagamento real será realizado.

          </p>

        </aside>

      </form>



      <Dialog

        open={dialogOpen && order !== null}

        onOpenChange={setDialogOpen}

      >

        <DialogContent className="max-h-[85vh] overflow-y-auto border border-[#D98845]/50 bg-[#1C1410] p-6 text-[#E8D9CE] sm:max-w-lg">

          <DialogHeader>

            <DialogTitle className="flex items-center justify-center gap-2 text-center text-lg font-bold text-[#D98845]">

              <CheckCircle2 className="h-6 w-6" />

              Compra simulada confirmada

            </DialogTitle>



            <DialogDescription className="text-center text-[#CFB28C]">

              O pedido foi registrado nesta demonstração do Kurio. Nenhuma

              transação real foi enviada à blockchain.

            </DialogDescription>

          </DialogHeader>



          {order && (

            <>

              <div className="grid grid-cols-2 gap-3 border-y border-[#D98845]/30 py-4 text-xs">

                <div>

                  <p className="text-[#B39463]">Pedido</p>

                  <p className="mt-1 break-all font-bold text-[#D98845]">

                    {order.id}

                  </p>

                </div>



                <div>

                  <p className="text-[#B39463]">Data</p>

                  <p className="mt-1">

                    {new Date(order.date).toLocaleString("pt-BR")}

                  </p>

                </div>



                <div>

                  <p className="text-[#B39463]">Carteira selecionada</p>

                  <p className="mt-1">{order.wallet}</p>

                </div>



                <div>

                  <p className="text-[#B39463]">Rede selecionada</p>

                  <p className="mt-1">{order.network}</p>

                </div>



                <div>

                  <p className="text-[#B39463]">Status</p>

                  <p className="mt-1 text-[#D98845]">

                    {order.status === "confirmed"

                      ? "Confirmado"

                      : order.status}

                  </p>

                </div>

              </div>



              <div className="space-y-3">

                {order.items.map((item) => (

                  <div

                    key={item.id}

                    className="flex items-center gap-3 bg-[#241612] p-3"

                  >

                    <Image

                      src={item.image}

                      alt={item.name}

                      className="h-14 w-14 rounded-md object-cover"

                    />



                    <div className="min-w-0 flex-1">

                      <p className="truncate text-xs">{item.name}</p>

                      <p className="mt-1 text-[10px] text-[#B39463]">

                        Quantidade: {item.quantity}

                      </p>

                    </div>



                    <p className="shrink-0 text-xs font-bold text-[#D98845]">

                      {formatEth(item.price * item.quantity)}

                    </p>

                  </div>

                ))}

              </div>



              <div className="flex justify-between border-t border-[#D98845]/30 pt-4 font-bold">

                <span>Total do pedido</span>

                <span className="text-[#D98845]">

                  {formatEth(order.total)}

                </span>

              </div>



              <button

                type="button"

                onClick={finishOrder}

                className="w-full rounded-sm bg-[#D98845] p-3 text-xs font-bold text-[#110B08] hover:bg-[#E8A15F]"

              >

                Concluir e voltar ao mercado

              </button>

            </>

          )}

        </DialogContent>

      </Dialog>

    </section>

  );

}
