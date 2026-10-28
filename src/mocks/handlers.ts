
import { http, HttpResponse, ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";

// -----------------------------------------------------------------------------
// Tipos
// -----------------------------------------------------------------------------

interface StoredWalletProfile {
  displayName: string;
  walletName: string;
  network: string;
  profileName: string;
  address: string;
  walletType: string;
  secondaryWallet: string;
  email: string;
  ensExtension: string;
  ensName: string;
  secondarySameAsPrimary: boolean;
}

interface MockUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  ensName: string;
  walletName: string;
}

interface StoredUser extends MockUser {
  password: string;
}

interface StoredWallet {
  connected: boolean;
  address: string | null;
  name: string | null;
  network: string | null;
  connectedAt: string | null;
}

interface MockOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface StoredOrder {
  id: string;
  userId: string;
  date: string;
  status: "confirmed";
  subtotal: number;
  discount: number;
  networkFee: number;
  total: number;
  wallet: string;
  network: string;
  walletAddress: string;
  items: MockOrderItem[];
}

interface CreateOrderBody {
  items?: {
    id: string;
    name?: string;
    quantity: number;
    price?: number;
    image?: string;
  }[];
  wallet?: string;
  network?: string;
  walletAddress?: string;
  walletType?: string;
  displayName?: string;
  username?: string;
  profileName?: string;
  email?: string;
  secondaryWallet?: string;
  referralCode?: string;
  ensName?: string;
  observation?: string;
  promoCode?: string;
}

// -----------------------------------------------------------------------------
// Armazenamento
// -----------------------------------------------------------------------------

const USERS_STORAGE_KEY = "kurio_mock_users";
const WALLETS_STORAGE_KEY = "kurio_mock_wallets";
const WALLET_PROFILES_STORAGE_KEY = "kurio_mock_wallet_profiles";
const ORDERS_STORAGE_KEY = "kurio_mock_orders";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Usuários
// -----------------------------------------------------------------------------

function loadUsers(): StoredUser[] {
  const result = readStorage<unknown>(USERS_STORAGE_KEY, []);

  if (!Array.isArray(result)) {
    return [];
  }

  return result.filter(
    (user): user is StoredUser =>
      user !== null &&
      typeof user === "object" &&
      typeof user.id === "string" &&
      typeof user.email === "string" &&
      typeof user.password === "string",
  );
}

const users: StoredUser[] = loadUsers();

function refreshUsers(): void {
  const storedUsers = loadUsers();
  users.splice(0, users.length, ...storedUsers);
}

function saveUsers(): boolean {
  return writeStorage(USERS_STORAGE_KEY, users);
}

function publicUser(user: StoredUser): MockUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

// -----------------------------------------------------------------------------
// Carteiras
// -----------------------------------------------------------------------------

function loadWallets(): Record<string, StoredWallet> {
  const result = readStorage<unknown>(WALLETS_STORAGE_KEY, {});

  return result !== null &&
    typeof result === "object" &&
    !Array.isArray(result)
    ? (result as Record<string, StoredWallet>)
    : {};
}

const wallets: Record<string, StoredWallet> = loadWallets();

function saveWallets(): boolean {
  return writeStorage(WALLETS_STORAGE_KEY, wallets);
}

function createEmptyWallet(): StoredWallet {
  return {
    connected: false,
    address: null,
    name: null,
    network: null,
    connectedAt: null,
  };
}

function createWalletAddress(userId: string): string {
  const hex = userId.replaceAll("-", "").padEnd(40, "0").slice(0, 40);
  return `0x${hex}`;
}

function getUserWallet(userId: string): StoredWallet {
  return wallets[userId] ?? createEmptyWallet();
}

const allowedWallets = ["MetaMask", "WalletConnect"];

// -----------------------------------------------------------------------------
// Perfis de carteira
// -----------------------------------------------------------------------------

function loadWalletProfiles(): Record<string, StoredWalletProfile> {
  const result = readStorage<unknown>(WALLET_PROFILES_STORAGE_KEY, {});

  return result !== null &&
    typeof result === "object" &&
    !Array.isArray(result)
    ? (result as Record<string, StoredWalletProfile>)
    : {};
}

const walletProfiles = loadWalletProfiles();

function saveWalletProfiles(): boolean {
  return writeStorage(WALLET_PROFILES_STORAGE_KEY, walletProfiles);
}

function createEmptyWalletProfile(): StoredWalletProfile {
  return {
    displayName: "",
    walletName: "",
    network: "",
    profileName: "",
    address: "",
    walletType: "",
    secondaryWallet: "",
    email: "",
    ensExtension: "",
    ensName: "",
    secondarySameAsPrimary: false,
  };
}

// -----------------------------------------------------------------------------
// Pedidos
// -----------------------------------------------------------------------------

function loadOrders(): StoredOrder[] {
  const result = readStorage<unknown>(ORDERS_STORAGE_KEY, []);

  if (!Array.isArray(result)) {
    return [];
  }

  return result.filter(
    (order): order is StoredOrder =>
      order !== null &&
      typeof order === "object" &&
      typeof order.id === "string" &&
      typeof order.userId === "string" &&
      Array.isArray(order.items),
  );
}

const orders: StoredOrder[] = loadOrders();

function refreshOrders(): void {
  const storedOrders = loadOrders();
  orders.splice(0, orders.length, ...storedOrders);
}

function saveOrders(): boolean {
  return writeStorage(ORDERS_STORAGE_KEY, orders);
}

function publicOrder(order: StoredOrder) {
  const { userId: _userId, ...safeOrder } = order;
  return safeOrder;
}

function createOrderId(): string {
  return `KURIO-${crypto.randomUUID().toUpperCase()}`;
}

const NETWORK_FEE = 0.016;
const PROMO_CODE = "KURIO10";
const PROMO_DISCOUNT = 0.1;

// -----------------------------------------------------------------------------
// Autenticação
// -----------------------------------------------------------------------------

function getAuthenticatedUser(
  request: Request,
): StoredUser | undefined {
  refreshUsers();

  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  const token = authorization.slice("Bearer ".length);

  if (!token.startsWith("mock-token-")) {
    return undefined;
  }

  const userId = token.slice("mock-token-".length);

  if (!userId) {
    return undefined;
  }

  return users.find((user) => user.id === userId);
}

// -----------------------------------------------------------------------------
// Handlers
// -----------------------------------------------------------------------------

export const handlers = [
  // Endpoint de exemplo.
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),

  // ---------------------------------------------------------------------------
  // Autenticação
  // ---------------------------------------------------------------------------

  // Cadastro.
  http.post("*/api/auth/register", async ({ request }) => {
    let body: {
      username?: string;
      email?: string;
      password?: string;
    };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return HttpResponse.json(
        { message: "Os dados enviados são inválidos." },
        { status: 400 },
      );
    }

    refreshUsers();

    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!username || !email || !password) {
      return HttpResponse.json(
        { message: "Preencha todos os campos obrigatórios." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return HttpResponse.json(
        { message: "Informe um e-mail válido." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return HttpResponse.json(
        { message: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 },
      );
    }

    if (users.some((user) => user.email === email)) {
      return HttpResponse.json(
        { message: "Este e-mail já está cadastrado." },
        { status: 409 },
      );
    }

    const user: StoredUser = {
      id: crypto.randomUUID(),
      username,
      displayName: username,
      email,
      ensName: "",
      walletName: "",
      password,
    };

    users.push(user);

    if (!saveUsers()) {
      users.pop();

      return HttpResponse.json(
        { message: "Não foi possível salvar o cadastro." },
        { status: 500 },
      );
    }

    wallets[user.id] = createEmptyWallet();

    if (!saveWallets()) {
      // O cadastro foi salvo, mas a carteira inicial não pôde ser salva.
      // O usuário continua cadastrado.
      console.error("[MSW] Não foi possível salvar a carteira inicial.");
    }

    return HttpResponse.json(
      {
        user: publicUser(user),
        token: `mock-token-${user.id}`,
      },
      { status: 201 },
    );
  }),

  // Login.
  http.post("*/api/auth/login", async ({ request }) => {
    let body: { email?: string; password?: string };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return HttpResponse.json(
        { message: "Os dados enviados são inválidos." },
        { status: 400 },
      );
    }

    refreshUsers();

    const email = body.email?.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email === email && item.password === body.password,
    );

    if (!user) {
      return HttpResponse.json(
        { message: "E-mail ou senha inválidos." },
        { status: 401 },
      );
    }

    if (!wallets[user.id]) {
      wallets[user.id] = createEmptyWallet();
      saveWallets();
    }

    return HttpResponse.json({
      user: publicUser(user),
      token: `mock-token-${user.id}`,
    });
  }),

  // Usuário autenticado.
  http.get("*/api/auth/me", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    return HttpResponse.json(publicUser(user));
  }),

  // Logout.
  http.post("*/api/auth/logout", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: "Sessão encerrada.",
    });
  }),

  // ---------------------------------------------------------------------------
  // Perfil do usuário
  // ---------------------------------------------------------------------------

  http.patch("*/api/users/me", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    let body: Partial<
      Pick<
        MockUser,
        "username" | "displayName" | "email" | "ensName" | "walletName"
      >
    >;

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return HttpResponse.json(
        { message: "Os dados enviados são inválidos." },
        { status: 400 },
      );
    }

    const email = body.email?.trim().toLowerCase();

    if (
      email &&
      users.some((item) => item.id !== user.id && item.email === email)
    ) {
      return HttpResponse.json(
        { message: "Este e-mail já está sendo utilizado." },
        { status: 409 },
      );
    }

    const previous = { ...user };

    if (body.username !== undefined) user.username = body.username.trim();

    if (body.displayName !== undefined) {
      user.displayName = body.displayName.trim();
    }

    if (email !== undefined) user.email = email;

    if (body.ensName !== undefined) {
      user.ensName = body.ensName.trim();
    }

    if (body.walletName !== undefined) {
      user.walletName = body.walletName.trim();
    }

    if (!saveUsers()) {
      Object.assign(user, previous);

      return HttpResponse.json(
        { message: "Não foi possível salvar as alterações." },
        { status: 500 },
      );
    }

    return HttpResponse.json(publicUser(user));
  }),

  // Alteração de senha.
  http.patch("*/api/users/me/password", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    let body: { currentPassword?: string; newPassword?: string };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return HttpResponse.json(
        { message: "Os dados enviados são inválidos." },
        { status: 400 },
      );
    }

    if (!body.currentPassword || !body.newPassword) {
      return HttpResponse.json(
        { message: "Preencha todos os campos de senha." },
        { status: 400 },
      );
    }

    if (body.currentPassword !== user.password) {
      return HttpResponse.json(
        { message: "A senha atual está incorreta." },
        { status: 400 },
      );
    }

    if (body.newPassword.length < 8) {
      return HttpResponse.json(
        { message: "A nova senha deve ter pelo menos 8 caracteres." },
        { status: 400 },
      );
    }

    if (body.currentPassword === body.newPassword) {
      return HttpResponse.json(
        { message: "A nova senha deve ser diferente da atual." },
        { status: 400 },
      );
    }

    const previousPassword = user.password;
    user.password = body.newPassword;

    if (!saveUsers()) {
      user.password = previousPassword;

      return HttpResponse.json(
        { message: "Não foi possível salvar a nova senha." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      message: "Senha alterada com sucesso.",
    });
  }),

  // ---------------------------------------------------------------------------
  // Carteira
  // ---------------------------------------------------------------------------

  http.get("*/api/wallet", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    return HttpResponse.json(getUserWallet(user.id));
  }),

  http.post("*/api/wallet/connect", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    let body: { name?: string };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return HttpResponse.json(
        { message: "Os dados enviados são inválidos." },
        { status: 400 },
      );
    }

    if (!body.name || !allowedWallets.includes(body.name)) {
      return HttpResponse.json(
        { message: "Carteira inválida." },
        { status: 400 },
      );
    }

    const previous = wallets[user.id];

    const wallet: StoredWallet = {
      connected: true,
      address: createWalletAddress(user.id),
      name: body.name,
      network: "Ethereum",
      connectedAt: new Date().toISOString(),
    };

    wallets[user.id] = wallet;

    if (!saveWallets()) {
      if (previous) {
        wallets[user.id] = previous;
      } else {
        delete wallets[user.id];
      }

      return HttpResponse.json(
        { message: "Não foi possível salvar a carteira." },
        { status: 500 },
      );
    }

    return HttpResponse.json(wallet);
  }),

  http.post("*/api/wallet/disconnect", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    const previous = wallets[user.id];
    wallets[user.id] = createEmptyWallet();

    if (!saveWallets()) {
      if (previous) {
        wallets[user.id] = previous;
      } else {
        delete wallets[user.id];
      }

      return HttpResponse.json(
        { message: "Não foi possível desconectar a carteira." },
        { status: 500 },
      );
    }

    return HttpResponse.json(wallets[user.id]);
  }),

  // ---------------------------------------------------------------------------
  // Perfil da carteira
  // ---------------------------------------------------------------------------

  http.get("*/api/wallet/profile", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Faça login para consultar o perfil da carteira." },
        { status: 401 },
      );
    }

    return HttpResponse.json(
      walletProfiles[user.id] ?? createEmptyWalletProfile(),
    );
  }),

  http.put("*/api/wallet/profile", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Faça login para salvar o perfil da carteira." },
        { status: 401 },
      );
    }

    let body: Partial<StoredWalletProfile>;

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return HttpResponse.json(
        { message: "Os dados enviados são inválidos." },
        { status: 400 },
      );
    }

    const previous = walletProfiles[user.id];
    const previousProfile = previous ?? createEmptyWalletProfile();

    const profile: StoredWalletProfile = {
      ...previousProfile,
      displayName: String(body.displayName ?? previousProfile.displayName).trim(),
      walletName: String(body.walletName ?? previousProfile.walletName).trim(),
      network: String(body.network ?? previousProfile.network),
      profileName: String(body.profileName ?? previousProfile.profileName).trim(),
      address: String(body.address ?? previousProfile.address).trim(),
      walletType: String(body.walletType ?? previousProfile.walletType),
      secondaryWallet: String(
        body.secondaryWallet ?? previousProfile.secondaryWallet,
      ).trim(),
      email: String(body.email ?? previousProfile.email).trim().toLowerCase(),
      ensExtension: String(body.ensExtension ?? previousProfile.ensExtension),
      ensName: String(body.ensName ?? previousProfile.ensName).trim(),
      secondarySameAsPrimary:
        typeof body.secondarySameAsPrimary === "boolean"
          ? body.secondarySameAsPrimary
          : previousProfile.secondarySameAsPrimary,
    };

    const requiredFields: (keyof StoredWalletProfile)[] = [
      "displayName",
      "walletName",
      "network",
      "profileName",
      "address",
      "walletType",
      "email",
      "ensExtension",
    ];

    if (
      requiredFields.some(
        (field) => !String(profile[field] ?? "").trim(),
      )
    ) {
      return HttpResponse.json(
        { message: "Preencha todos os campos obrigatórios." },
        { status: 400 },
      );
    }

    walletProfiles[user.id] = profile;

    if (!saveWalletProfiles()) {
      if (previous) {
        walletProfiles[user.id] = previous;
      } else {
        delete walletProfiles[user.id];
      }

      return HttpResponse.json(
        { message: "Não foi possível salvar o perfil da carteira." },
        { status: 500 },
      );
    }

    return HttpResponse.json(profile);
  }),

  // ---------------------------------------------------------------------------
  // Pedidos
  // ---------------------------------------------------------------------------

  // Criar pedido.
  http.post("*/api/orders", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Faça login para finalizar a compra." },
        { status: 401 },
      );
    }

    let body: CreateOrderBody;

    try {
      body = (await request.json()) as CreateOrderBody;
    } catch {
      return HttpResponse.json(
        { message: "Os dados do pedido são inválidos." },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      body.items.length > 50
    ) {
      return HttpResponse.json(
        { message: "Adicione itens válidos ao pedido." },
        { status: 400 },
      );
    }

   const invalidItem = body.items.some(
  (item) =>
    !item ||
    typeof item.id !== "string" ||
    !item.id.trim() ||
    !Number.isInteger(item.quantity) ||
    item.quantity < 1 ||
    item.quantity > 50 ||
    typeof item.name !== "string" ||
    !item.name.trim() ||
    typeof item.price !== "number" ||
    !Number.isFinite(item.price) ||
    item.price < 0 ||
    typeof item.image !== "string",
);

    if (invalidItem) {
      return HttpResponse.json(
        { message: "Um ou mais itens possuem dados inválidos." },
        { status: 400 },
      );
    }

    const email = body.email?.trim().toLowerCase();

    if (
      !body.wallet ||
      !body.network ||
      !body.walletAddress?.trim() ||
      !body.walletType ||
      !body.displayName?.trim() ||
      !body.username?.trim() ||
      !body.profileName?.trim() ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return HttpResponse.json(
        { message: "Preencha corretamente os campos obrigatórios." },
        { status: 400 },
      );
    }

    const allowedNetworks = [
      "ethereum",
      "polygon",
      "solana",
      "bnb-chain",
      "avalanche",
      "arbitrum",
      "optimism",
      "base",
      "tezos",
      "bitcoin",
      "immutable",
      "flow",
      "ronin",
      "cronos",
      "cardano",
    ];

    const allowedCheckoutWallets = [
      "all",
      "metamask",
      "coinbase-wallet",
      "walletconnect",
    ];

    if (
      !allowedNetworks.includes(body.network) ||
      !allowedCheckoutWallets.includes(body.wallet)
    ) {
      return HttpResponse.json(
        { message: "A rede ou carteira selecionada é inválida." },
        { status: 400 },
      );
    }

    // Simulação: em produção, os preços devem vir de um catálogo confiável
    // no servidor, e não do corpo enviado pelo frontend.
    const orderItems: MockOrderItem[] = body.items.map((item) => ({
      id: item.id,
      name: item.name!.trim(),
      quantity: item.quantity,
      price: item.price!,
      image: item.image!,
    }));

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return HttpResponse.json(
        { message: "Não foi possível calcular o subtotal." },
        { status: 400 },
      );
    }

    const normalizedPromoCode = body.promoCode?.trim().toUpperCase();
    const discount =
      normalizedPromoCode === PROMO_CODE ? subtotal * PROMO_DISCOUNT : 0;
    const networkFee = NETWORK_FEE;
    const total = Math.max(0, subtotal - discount) + networkFee;

    const order: StoredOrder = {
      id: createOrderId(),
      userId: user.id,
      date: new Date().toISOString(),
      status: "confirmed",
      subtotal,
      discount,
      networkFee,
      total,
      wallet: body.wallet,
      network: body.network,
      walletAddress: body.walletAddress.trim(),
      items: orderItems,
    };

    // Atualiza a lista antes de adicionar, para reduzir inconsistências.
    refreshOrders();
    orders.push(order);

    if (!saveOrders()) {
      orders.pop();

      return HttpResponse.json(
        { message: "Não foi possível salvar o pedido." },
        { status: 500 },
      );
    }

    return HttpResponse.json(publicOrder(order), { status: 201 });
  }),

  // Listar pedidos do usuário autenticado.
  http.get("*/api/orders", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Faça login para consultar seus pedidos." },
        { status: 401 },
      );
    }

    refreshOrders();

    const userOrders = orders
      .filter((order) => order.userId === user.id)
      .map(publicOrder);

    return HttpResponse.json(userOrders);
  }),

  // Consultar um pedido específico do usuário autenticado.
  http.get("*/api/orders/:id", ({ request, params }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Faça login para consultar seus pedidos." },
        { status: 401 },
      );
    }

    refreshOrders();

    const order = orders.find(
      (item) =>
        item.id === String(params.id) &&
        item.userId === user.id,
    );

    if (!order) {
      return HttpResponse.json(
        { message: "Pedido não encontrado." },
        { status: 404 },
      );
    }

    return HttpResponse.json(publicOrder(order));
  }),
];

// -----------------------------------------------------------------------------
// WebSocket de teste
// -----------------------------------------------------------------------------

const nftSocket = ws.link("ws://localhost:5173/socket.io-mock/");

nftSocket.addEventListener("connection", (connection) => {
  console.log("[MSW] WebSocket conectado");

  const { client } = toSocketIo(connection);
   connectedClients.add(client);

  client.on("hello", (_event, name) => {
    console.log("[MSW] Evento hello recebido:", name);
    client.emit("greeting", `Olá, ${name}!`);
  });
});
const connectedClients = new Set<
  ReturnType<typeof toSocketIo>["client"]
>();