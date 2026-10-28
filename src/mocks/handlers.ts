
import { http, HttpResponse, ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";

interface MockUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  ensName: string;
  walletName: string;
}

interface StoredUser extends MockUser {
  // Somente para simulação local. Não use este modelo em produção.
  password: string;
}

const USERS_STORAGE_KEY = "kurio_mock_users";
const SESSION_STORAGE_KEY = "kurio_mock_current_user";

// Recupera os usuários salvos no navegador.
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

function loadCurrentUserId(): string | null {
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

function saveCurrentUserId(id: string | null) {
  if (id) {
    localStorage.setItem(SESSION_STORAGE_KEY, id);
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

const users: StoredUser[] = loadUsers();
let currentUserId: string | null = loadCurrentUserId();

const nftSocket = ws.link("ws://localhost:5173/socket.io-mock/");

function publicUser(user: StoredUser): MockUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function getCurrentUser(): StoredUser | undefined {
  return users.find((user) => user.id === currentUserId);
}

export const handlers = [
  // Endpoint de exemplo.
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

    currentUserId = user.id;
    saveCurrentUserId(currentUserId);

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

    currentUserId = user.id;
    saveCurrentUserId(currentUserId);

    return HttpResponse.json({
      user: publicUser(user),
      token: `mock-token-${user.id}`,
    });
  }),

  // Consulta a sessão atual.
  http.get("*/api/auth/me", () => {
    const user = getCurrentUser();

    if (!user) {
      return HttpResponse.json(
        { message: "Você não está autenticado." },
        { status: 401 },
      );
    }

    return HttpResponse.json(publicUser(user));
  }),

  // Atualiza os dados do perfil.
  http.patch("*/api/users/me", async ({ request }) => {
    const user = getCurrentUser();

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

    if (body.username !== undefined) {
      user.username = body.username.trim();
    }

    if (body.displayName !== undefined) {
      user.displayName = body.displayName.trim();
    }

    if (email !== undefined) {
      user.email = email;
    }

    if (body.ensName !== undefined) {
      user.ensName = body.ensName.trim();
    }

    if (body.walletName !== undefined) {
      user.walletName = body.walletName.trim();
    }

    saveUsers();

    return HttpResponse.json(publicUser(user));
  }),

http.patch("*/api/users/me/password", async ({ request }) => {
  const user = getCurrentUser();

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

    return HttpResponse.json({
      message: "Senha alterada com sucesso.",
    });
  }),

  // Encerra a sessão, sem apagar a conta ou o perfil.
  http.post("*/api/auth/logout", () => {
    currentUserId = null;
    saveCurrentUserId(null);

    return HttpResponse.json({ message: "Sessão encerrada." });
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
