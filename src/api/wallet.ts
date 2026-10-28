
import { api } from "@/api/client";

export interface Wallet {
  connected: boolean;
  address: string | null;
  name: string | null;
  network: string | null;
  connectedAt: string | null;
}

export interface WalletProfile {
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

export const emptyWalletProfile: WalletProfile = {
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

export async function getWallet(): Promise<Wallet> {
  const response = await api.get<Wallet>("/wallet");
  return response.data;
}

export async function connectWallet(name: string): Promise<Wallet> {
  const response = await api.post<Wallet>("/wallet/connect", { name });
  return response.data;
}

export async function disconnectWallet(): Promise<Wallet> {
  const response = await api.post<Wallet>("/wallet/disconnect");
  return response.data;
}

export async function getWalletProfile(): Promise<WalletProfile> {
  const response = await api.get<WalletProfile>("/wallet/profile");
  return response.data;
}

export async function saveWalletProfile(
  profile: WalletProfile,
): Promise<WalletProfile> {
  const response = await api.put<WalletProfile>(
    "/wallet/profile",
    profile,
  );

  return response.data;
}
