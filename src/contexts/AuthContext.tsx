
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type LoginData,
  type RegisterData,
  type User,
} from "@/api/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_QUERY_KEY = ["auth", "user"];

export function AuthProvider({ children }: { children: ReactNode }) {
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
    onSuccess: (response) => {
      queryClient.setQueryData(USER_QUERY_KEY, response.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (response) => {
      queryClient.setQueryData(USER_QUERY_KEY, response.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
    },
  });

  async function login(data: LoginData) {
    const response = await loginMutation.mutateAsync(data);
    return response.user;
  }

  async function register(data: RegisterData) {
    const response = await registerMutation.mutateAsync(data);
    return response.user;
  }

  async function logout() {
    await logoutMutation.mutateAsync();
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
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
