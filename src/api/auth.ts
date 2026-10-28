
import { api } from "./client";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  ensName: string;
  walletName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data,
  );

  return response.data;
}

export async function register(data: RegisterData) {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data,
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<User>("/auth/me");

  return response.data;
}

export async function updateProfile(
  data: Partial<
    Pick<User, "username" | "displayName" | "email" | "ensName" | "walletName">
  >,
) {
  const response = await api.patch<User>("/users/me", data);

  return response.data;
}

export async function logout() {
  await api.post("/auth/logout");
}


export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: ChangePasswordData) {
  const response = await api.patch<{ message: string }>(
    "/users/me/password",
    data,
  );

  return response.data;
}
