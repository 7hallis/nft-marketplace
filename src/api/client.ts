
import axios from "axios";

const TOKEN_KEY = "kurio-auth-token";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common.Authorization;
}

// Restaura o token ao inicializar a aplicação.
if (typeof window !== "undefined") {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}
