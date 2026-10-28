
import { http, HttpResponse, ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";

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

const USERS_STORAGE_KEY = "kurio_mock_users";
// const SESSION_STORAGE_KEY = "kurio_mock_current_user";
const WALLETS_STORAGE_KEY = "kurio_mock_wallets";
const WALLET_PROFILES_STORAGE_KEY = "kurio_mock_wallet_profiles";

function loadWalletProfiles(): Record<string, StoredWalletProfile> {
  try {
    const stored = localStorage.getItem(WALLET_PROFILES_STORAGE_KEY);
    return stored
      ? (JSON.parse(stored) as Record<string, StoredWalletProfile>)
      : {};
  } catch {
    return {};
  }
}

function saveWalletProfiles(
  profiles: Record<string, StoredWalletProfile>,
) {
  localStorage.setItem(
    WALLET_PROFILES_STORAGE_KEY,
    JSON.stringify(profiles),
  );
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

const walletProfiles = loadWalletProfiles();

function loadUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers() {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// function saveCurrentUserId(id: string | null) {
//   if (id) {
//     localStorage.setItem(SESSION_STORAGE_KEY, id);
//   } else {
//     localStorage.removeItem(SESSION_STORAGE_KEY);
//   }
// }

function loadWallets(): Record<string, StoredWallet> {
  try {
    const stored = localStorage.getItem(WALLETS_STORAGE_KEY);
    return stored
      ? (JSON.parse(stored) as Record<string, StoredWallet>)
      : {};
  } catch {
    return {};
  }
}

function saveWallets() {
  localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));
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

const users: StoredUser[] = loadUsers();
const wallets: Record<string, StoredWallet> = loadWallets();

const nftSocket = ws.link("ws://localhost:5173/socket.io-mock/");

function publicUser(user: StoredUser): MockUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

/**
 * Resolve o usuário pelo Bearer token da requisição.
 * O token simulado identifica o usuário, não a sessão global.
 */
function getAuthenticatedUser(
  request: Request,
): StoredUser | undefined {
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

function getUserWallet(userId: string): StoredWallet {
  return wallets[userId] ?? createEmptyWallet();
}

const allowedWallets = ["MetaMask", "WalletConnect"];

// Endpoints da aplicação.

export const handlers = [
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),

  // Cadastro.
  http.post("*/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      username?: string;
      email?: string;
      password?: string;
    };

    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!username || !email || !password) {
      return HttpResponse.json(
        { message: "Preencha todos os campos obrigatórios." },
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
    saveUsers();

    wallets[user.id] = createEmptyWallet();
    saveWallets();

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
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

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

  // Consulta a sessão autenticada.
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

  // Atualiza os dados básicos do usuário.
  http.patch("*/api/users/me", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Partial<
      Pick<
        MockUser,
        "username" | "displayName" | "email" | "ensName" | "walletName"
      >
    >;

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

    if (body.username !== undefined) user.username = body.username.trim();
    if (body.displayName !== undefined) user.displayName = body.displayName.trim();
    if (email !== undefined) user.email = email;
    if (body.ensName !== undefined) user.ensName = body.ensName.trim();
    if (body.walletName !== undefined) user.walletName = body.walletName.trim();

    saveUsers();

    return HttpResponse.json(publicUser(user));
  }),

  // Altera a senha.
  http.patch("*/api/users/me/password", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

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

    user.password = body.newPassword;
    saveUsers();

    return HttpResponse.json({ message: "Senha alterada com sucesso." });
  }),

  // Consulta a carteira conectada.
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

  // Conecta uma carteira simulada.
  http.post("*/api/wallet/connect", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as { name?: string };

    if (!body.name || !allowedWallets.includes(body.name)) {
      return HttpResponse.json(
        { message: "Carteira inválida." },
        { status: 400 },
      );
    }

    const wallet: StoredWallet = {
      connected: true,
      address: createWalletAddress(user.id),
      name: body.name,
      network: "Ethereum",
      connectedAt: new Date().toISOString(),
    };

    wallets[user.id] = wallet;
    saveWallets();

    return HttpResponse.json(wallet);
  }),

  // Desconecta a carteira sem apagar o perfil salvo.
  http.post("*/api/wallet/disconnect", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    wallets[user.id] = createEmptyWallet();
    saveWallets();

    return HttpResponse.json(wallets[user.id]);
  }),

  // Consulta o perfil da carteira.
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

  // Salva o perfil da carteira.
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
      body = (await request.json()) as Partial<StoredWalletProfile>;
    } catch {
      return HttpResponse.json(
        { message: "Os dados enviados são inválidos." },
        { status: 400 },
      );
    }

    const previous =
      walletProfiles[user.id] ?? createEmptyWalletProfile();

    const profile: StoredWalletProfile = {
      ...previous,
      displayName: String(body.displayName ?? previous.displayName).trim(),
      walletName: String(body.walletName ?? previous.walletName).trim(),
      network: String(body.network ?? previous.network),
      profileName: String(body.profileName ?? previous.profileName).trim(),
      address: String(body.address ?? previous.address).trim(),
      walletType: String(body.walletType ?? previous.walletType),
      secondaryWallet: String(
        body.secondaryWallet ?? previous.secondaryWallet,
      ).trim(),
      email: String(body.email ?? previous.email).trim().toLowerCase(),
      ensExtension: String(body.ensExtension ?? previous.ensExtension),
      ensName: String(body.ensName ?? previous.ensName).trim(),
      secondarySameAsPrimary:
        typeof body.secondarySameAsPrimary === "boolean"
          ? body.secondarySameAsPrimary
          : previous.secondarySameAsPrimary,
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
    saveWalletProfiles(walletProfiles);

    return HttpResponse.json(profile);
  }),

  // Encerra a sessão no servidor simulado.
  http.post("*/api/auth/logout", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    // Não existe mais uma sessão global para limpar.
    // O cliente remove o token após receber sucesso.
    return HttpResponse.json({
      message: "Sessão encerrada.",
    });
  }),
];

// WebSocket de teste.
nftSocket.addEventListener("connection", (connection) => {
  console.log("[MSW] WebSocket conectado");

  const { client } = toSocketIo(connection);

  client.on("hello", (_event, name) => {
    console.log("[MSW] Evento hello recebido:", name);
    client.emit("greeting", `Olá, ${name}!`);
  });
});
