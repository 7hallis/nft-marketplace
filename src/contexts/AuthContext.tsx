
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type LoginData,
  type RegisterData,
  type User,
} from "@/api/auth";

import { setAuthToken } from "@/api/client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const USER_QUERY_KEY = ["auth", "user"] as const;

/**
 * Cancela consultas em andamento e remove o cache privado.
 * Mantém a consulta de autenticação para atualizar a sessão.
 */
async function clearPrivateCache(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  await queryClient.cancelQueries();

  queryClient.removeQueries({
    predicate: (query) =>
      query.queryKey[0] !== USER_QUERY_KEY[0],
  });
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = useQueryClient();

  const [sessionChecked, setSessionChecked] = useState(false);

  const userQuery = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!userQuery.isPending) {
      setSessionChecked(true);
    }
  }, [userQuery.isPending]);

  const loginMutation = useMutation({
    mutationFn: loginRequest,

    onSuccess: async ({ user, token }) => {
      await clearPrivateCache(queryClient);

      setAuthToken(token);

      queryClient.setQueryData<User | null>(
        USER_QUERY_KEY,
        user,
      );
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,

    onSuccess: async ({ user, token }) => {
      await clearPrivateCache(queryClient);

      setAuthToken(token);

      queryClient.setQueryData<User | null>(
        USER_QUERY_KEY,
        user,
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,

    onSuccess: async () => {
      setAuthToken(null);

      await clearPrivateCache(queryClient);

      queryClient.setQueryData<User | null>(
        USER_QUERY_KEY,
        null,
      );
    },
  });

  async function login(data: LoginData): Promise<User> {
    const response = await loginMutation.mutateAsync(data);

    return response.user;
  }

  async function register(data: RegisterData): Promise<User> {
    const response = await registerMutation.mutateAsync(data);

    return response.user;
  }

 async function logout(): Promise<void> {
  try {
    await logoutMutation.mutateAsync();
  } finally {
    // Garante que a sessão local seja encerrada
    // mesmo se a requisição de logout falhar.
    setAuthToken(null);

    await queryClient.cancelQueries();
    queryClient.clear();

    queryClient.setQueryData<User | null>(
      USER_QUERY_KEY,
      null,
    );

    setSessionChecked(true);
  }
}

  const user = userQuery.data ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading: !sessionChecked,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider.",
    );
  }

  return context;
}
